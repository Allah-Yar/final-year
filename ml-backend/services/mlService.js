import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// const ML_SERVICE_URL = 'http://localhost:5000/predict'; // Change if ML service runs on a different port

const detectFakeCurrency = async (imagePath) => {
    try {
        console.log("🔍 Sending request to ML service with:", file);

        // Prepare form data for image upload
        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        // Send request to ML service
        const response = await axios.post(ML_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        return response.data; // ML service response
    } catch (error) {
        console.error('❌ ML Service Error:', error.message);
        throw new Error('Error communicating with ML service');
    }
};

export default detectFakeCurrency;

