import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime
import cv2
from pathlib import Path
from config import Config  # Import the Config class

# Initialize Flask app
app = Flask(__name__)
Config.init_app(app)  # Initialize app with configurations
CORS(app, origins=Config.CORS_ORIGINS)

# Initialize database
db = SQLAlchemy(app)

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ==============================
# Database Models
# ==============================
class UploadedImage(db.Model):
    """Model for storing uploaded images and their metadata"""
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    mime_type = db.Column(db.String(100), nullable=False)
    upload_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    prediction_result = db.Column(db.String(100), nullable=True)
    confidence_score = db.Column(db.Float, nullable=True)
    processing_time = db.Column(db.Float, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'upload_timestamp': self.upload_timestamp.isoformat() if self.upload_timestamp else None,
            'prediction_result': self.prediction_result,
            'confidence_score': self.confidence_score,
            'processing_time': self.processing_time
        }


class ModelPerformance(db.Model):
    """Model for tracking model performance metrics"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    total_predictions = db.Column(db.Integer, default=0)
    correct_predictions = db.Column(db.Integer, default=0)
    accuracy = db.Column(db.Float, default=0.0)
    avg_processing_time = db.Column(db.Float, default=0.0)
    model_version = db.Column(db.String(100), nullable=True)


# ==============================
# Load the trained model
# ==============================
MODEL_PATH = Config.MODEL_PATH
try:
    if MODEL_PATH.exists():
        model = load_model(MODEL_PATH)
        print(f"✅ Model loaded successfully from: {MODEL_PATH}")
    else:
        print(f"⚠️ Model file not found at: {MODEL_PATH}")
        print("   This is normal for first-time setup.")
        print("   You can train a model using the training scripts.")
        model = None
except Exception as e:
    print(f"❌ Error loading model: {str(e)}")
    print("   This is normal for first-time setup.")
    print("   You can train a model using the training scripts.")
    model = None

# Label mapping
class_labels = Config.MODEL_CLASSES


# ==============================
# Image Processing
# ==============================
def process_image(img_path):
    """Enhanced image processing with multiple preprocessing techniques"""
    try:
        img = Image.open(img_path).convert("RGB")
        img = img.resize((Config.MODEL_INPUT_SIZE[0], Config.MODEL_INPUT_SIZE[1]))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"❌ Error processing image: {str(e)}")
        return None


def validate_image_file(file):
    """Validate uploaded image file"""
    allowed_extensions = Config.ALLOWED_EXTENSIONS
    allowed_mime_types = {
        'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
        'image/bmp', 'image/tiff'
    }

    if '.' not in file.filename:
        return False, "No file extension"

    extension = file.filename.rsplit('.', 1)[1].lower()
    if extension not in allowed_extensions:
        return False, f"File extension '{extension}' not allowed"

    if file.content_type not in allowed_mime_types:
        return False, f"MIME type '{file.content_type}' not allowed"

    return True, "Valid file"


# ==============================
# API Routes
# ==============================
@app.route("/")
def home():
    return jsonify({
        "message": "Pakistani Currency Detection API",
        "version": "2.0",
        "status": "active",
        "endpoints": {
            "predict": "/predict",
            "predict_multiple": "/predict_multiple",
            "upload_history": "/upload_history",
            "model_stats": "/model_stats"
        }
    })


@app.route("/predict", methods=["POST"])
def predict_single():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    is_valid, message = validate_image_file(file)
    if not is_valid:
        return jsonify({"error": message}), 400

    try:
        start_time = datetime.utcnow()
        unique_filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        img = process_image(filepath)
        if img is None:
            return jsonify({"error": "Failed to process image"}), 500

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        prediction = model.predict(img, verbose=0)[0]
        predicted_index = np.argmax(prediction)
        predicted_label = class_labels[predicted_index]
        confidence = float(np.max(prediction))

        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds()

        if predicted_label == "not_currency":
            result_msg = "🚫 This is not a currency image. Please upload a valid PKR note."
        elif predicted_label == "real":
            result_msg = "✅ This is a Real PKR Currency Note."
        elif predicted_label == "fake":
            result_msg = "❌ This is a Fake PKR Currency Note."
        else:
            result_msg = "⚠️ Unable to classify the image."

        uploaded_image = UploadedImage(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=filepath,
            file_size=os.path.getsize(filepath),
            mime_type=file.content_type,
            prediction_result=predicted_label,
            confidence_score=confidence,
            processing_time=processing_time,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )

        db.session.add(uploaded_image)
        db.session.commit()

        return jsonify({
            "filename": file.filename,
            "prediction": result_msg,
            "label": predicted_label,
            "confidence": confidence,
            "processing_time": processing_time,
            "upload_id": uploaded_image.id
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


@app.route("/predict_multiple", methods=["POST"])
def predict_multiple():
    if "files" not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist("files")
    if not files or all(file.filename == "" for file in files):
        return jsonify({"error": "No selected files"}), 400

    results = []

    for file in files:
        if file.filename == "":
            continue

        is_valid, message = validate_image_file(file)
        if not is_valid:
            results.append({
                "filename": file.filename,
                "error": message,
                "status": "failed"
            })
            continue

        try:
            start_time = datetime.utcnow()
            unique_filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)

            img = process_image(filepath)
            if img is None:
                results.append({
                    "filename": file.filename,
                    "error": "Failed to process image",
                    "status": "failed"
                })
                continue

            if model is None:
                results.append({
                    "filename": file.filename,
                    "error": "Model not loaded",
                    "status": "failed"
                })
                continue

            prediction = model.predict(img, verbose=0)[0]
            predicted_index = np.argmax(prediction)
            predicted_label = class_labels[predicted_index]
            confidence = float(np.max(prediction))

            end_time = datetime.utcnow()
            processing_time = (end_time - start_time).total_seconds()

            if predicted_label == "not_currency":
                result_msg = "🚫 This is not a currency image. Please upload a valid PKR note."
            elif predicted_label == "real":
                result_msg = "✅ This is a Real PKR Currency Note."
            elif predicted_label == "fake":
                result_msg = "❌ This is a Fake PKR Currency Note."
            else:
                result_msg = "⚠️ Unable to classify the image."

            uploaded_image = UploadedImage(
                filename=unique_filename,
                original_filename=file.filename,
                file_path=filepath,
                file_size=os.path.getsize(filepath),
                mime_type=file.content_type,
                prediction_result=predicted_label,
                confidence_score=confidence,
                processing_time=processing_time,
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent')
            )

            db.session.add(uploaded_image)

            results.append({
                "filename": file.filename,
                "prediction": result_msg,
                "label": predicted_label,
                "confidence": confidence,
                "processing_time": processing_time,
                "upload_id": uploaded_image.id,
                "status": "success"
            })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": f"Prediction failed: {str(e)}",
                "status": "failed"
            })

    db.session.commit()

    return jsonify({
        "total_files": len(files),
        "successful_predictions": len([r for r in results if r["status"] == "success"]),
        "failed_predictions": len([r for r in results if r["status"] == "failed"]),
        "results": results
    })


@app.route("/upload_history", methods=["GET"])
def get_upload_history():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    uploads = UploadedImage.query.order_by(
        UploadedImage.upload_timestamp.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "uploads": [upload.to_dict() for upload in uploads.items],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": uploads.total,
            "pages": uploads.pages,
            "has_next": uploads.has_next,
            "has_prev": uploads.has_prev
        }
    })


@app.route("/model_stats", methods=["GET"])
def get_model_stats():
    total_uploads = UploadedImage.query.count()
    recent_uploads = UploadedImage.query.filter(
        UploadedImage.upload_timestamp >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    ).count()

    real_predictions = UploadedImage.query.filter_by(prediction_result="real").count()
    fake_predictions = UploadedImage.query.filter_by(prediction_result="fake").count()
    not_currency_predictions = UploadedImage.query.filter_by(prediction_result="not_currency").count()

    avg_processing_time = db.session.query(
        db.func.avg(UploadedImage.processing_time)
    ).scalar() or 0.0

    return jsonify({
        "total_uploads": total_uploads,
        "uploads_today": recent_uploads,
        "predictions_distribution": {
            "real": real_predictions,
            "fake": fake_predictions,
            "not_currency": not_currency_predictions
        },
        "average_processing_time": round(avg_processing_time, 3),
        "model_status": "active" if model is not None else "inactive"
    })


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "model_loaded": model is not None,
        "database_connected": True
    })


# ==============================
# Init DB
# ==============================
with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
