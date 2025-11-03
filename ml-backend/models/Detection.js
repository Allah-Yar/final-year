import mongoose from 'mongoose';

const detectionSchema = mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Detection = mongoose.model('Detection', detectionSchema);

export default Detection;