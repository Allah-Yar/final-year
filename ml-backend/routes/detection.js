



import express from 'express';
import {
    getDetections,
    getDetectionById,
    createDetection,
    deleteDetection
} from '../controllers/detectionController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
    .get(getDetections)
    .post(upload.single('image'), createDetection); // Ensure image upload before calling the controller

router.route('/:id')
    .get(getDetectionById)
    .delete(deleteDetection);

export default router;
