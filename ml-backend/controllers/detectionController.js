

import detectFakeCurrency from '../services/mlService.js';
import asyncHandler from 'express-async-handler';
import Detection from '../models/Detection.js';
import fs from 'fs';

// @desc    Get all detections
// @route   GET /api/detections
// @access  Public
const getDetections = asyncHandler(async (req, res) => {
    const detections = await Detection.find({});
    res.json(detections);
});

// @desc    Get single detection
// @route   GET /api/detections/:id
// @access  Public
const getDetectionById = asyncHandler(async (req, res) => {
    const detection = await Detection.findById(req.params.id);
    
    if (detection) {
        res.json(detection);
    } else {
        res.status(404);
        throw new Error('Detection not found');
    }
});

// @desc    Create new detection (Uploads Image & Calls ML Service)
// @route   POST /api/detections
// @access  Public
const createDetection = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an image');
        }

        const filePath = req.file.path; // Uploaded image path

        // Call ML service for fake currency detection
        const predictionResult = await detectFakeCurrency(filePath);

        // Save detection result in MongoDB
        const detection = await Detection.create({
            imageUrl: req.file.filename,
            result: predictionResult.isFake ? 'Fake' : 'Genuine',
            confidence: predictionResult.confidence
        });

        res.status(201).json(detection);

        // Optional: Delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete uploaded image:', err);
        });

    } catch (error) {
        console.error('❌ Detection Error:', error);
        res.status(500).json({ success: false, message: 'Server error during detection' });
    }
});

// @desc    Delete detection
// @route   DELETE /api/detections/:id
// @access  Public
const deleteDetection = asyncHandler(async (req, res) => {
    const detection = await Detection.findById(req.params.id);

    if (detection) {
        await Detection.deleteOne({ _id: req.params.id });
        res.json({ message: 'Detection removed' });
    } else {
        res.status(404);
        throw new Error('Detection not found');
    }
});

export {
    getDetections,
    getDetectionById,
    createDetection,
    deleteDetection
};
