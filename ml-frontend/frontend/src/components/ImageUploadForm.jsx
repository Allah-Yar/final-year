// Code for the ImageUploadForm component of the frontend
// This component is responsible for rendering the image upload form and handling the image classification process
import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Alert,
  Menu,
  MenuItem,
  Modal,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PredictionResult from './PredictionResult';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, getEndpoint, API_CONFIG } from '../config/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  width: '90%',
  margin: theme.spacing(3, 'auto'),
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  borderRadius: 15,
  border: '1px solid rgba(84, 110, 122, 0.2)',
  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 'auto'),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 5),
  borderRadius: 30,
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  background: "linear-gradient(90deg, #4a90e2 0%, #50bfa5 100%)",
  color: 'white',
  boxShadow: '0 4px 15px rgba(84, 110, 122, 0.5)',
  transition: 'transform 0.2s ease, background 0.3s ease',
  '&:hover': {
    background: "linear-gradient(90deg, #357ab7 0%, #4299e1 100%)",
    transform: 'scale(1.05)',
    boxShadow: "0 6px 20px rgba(74, 144, 226, 0.6)",
  },
  '&:disabled': {
    background: '#b0bec5',
    boxShadow: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
  },
}));

const ImagePreview = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: 12,
  marginTop: theme.spacing(3),
  border: '2px solid #546e7a',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    borderRadius: 8,
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  borderRadius: 15,
  padding: theme.spacing(3),
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
}));

const ImageCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: 12,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const ImageUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'multiple'
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (uploadMode === 'single') {
      handleSingleFile(files[0]);
    } else {
      handleMultipleFiles(files);
    }
  };

  const handleSingleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFiles([file]);
      const url = URL.createObjectURL(file);
      setPreviewUrls([url]);
      setError('');
      setSuccess('');
      setPredictionResults([]);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleMultipleFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setError('Please select valid image files.');
      return;
    }
    
    setSelectedFiles(validFiles);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setError('');
    setSuccess('');
    setPredictionResults([]);
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleCameraCaptureSuccess = (imageBlob) => {
    const file = new File([imageBlob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
    if (uploadMode === 'single') {
      handleSingleFile(file);
    } else {
      setSelectedFiles(prev => [...prev, file]);
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    }
    setShowCamera(false);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setPredictionResults(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setPredictionResults([]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      if (uploadMode === 'single') {
        formData.append('file', selectedFiles[0]);
        const response = await axios.post(buildApiUrl(getEndpoint('PREDICT_SINGLE')), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: API_CONFIG.REQUEST_CONFIG.timeout,
        });
        
        setPredictionResults([response.data]);
        setSuccess('Image processed successfully!');
      } else {
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await axios.post(buildApiUrl(getEndpoint('PREDICT_MULTIPLE')), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
          timeout: API_CONFIG.REQUEST_CONFIG.timeout,
        });
        
        setPredictionResults(response.data.results);
        setSuccess(`${response.data.successful_predictions} images processed successfully!`);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred while processing the images. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUploadMode = () => {
    setUploadMode(prev => prev === 'single' ? 'multiple' : 'single');
    clearAll();
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Pakistani Currency Detection
      </Typography>
      
      <Typography variant="body1" color="textSecondary" align="center" paragraph>
        Upload images of Pakistani currency notes to detect if they are real or fake
        </Typography>

      {/* Upload Mode Toggle */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Chip
          label="Single Image"
          color={uploadMode === 'single' ? 'primary' : 'default'}
          onClick={() => setUploadMode('single')}
          sx={{ mr: 1 }}
        />
        <Chip
          label="Multiple Images"
          color={uploadMode === 'multiple' ? 'primary' : 'default'}
          onClick={() => setUploadMode('multiple')}
        />
      </Box>

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* File Upload Section */}
      <Box
  sx={{
          border: '2px dashed #546e7a',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          mb: 3,
          backgroundColor: 'rgba(84, 110, 122, 0.05)',
        }}
      >
            <input
          ref={fileInputRef}
              type="file"
          multiple={uploadMode === 'multiple'}
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

        <UploadFileIcon sx={{ fontSize: 48, color: '#546e7a', mb: 2 }} />
        
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {uploadMode === 'single' ? 'Choose an image file' : 'Choose multiple image files'}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Supported formats: JPG, PNG, JPEG, GIF, BMP, TIFF
        </Typography>
        
        <Box sx={{ mt: 2 }}>
            <StyledButton
              variant="contained"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<UploadFileIcon />}
            sx={{ mr: 2 }}
            >
            Browse Files
            </StyledButton>
          
          <StyledButton
              variant="outlined"
            onClick={handleCameraCapture}
            startIcon={<CameraAltIcon />}
              sx={{
                borderColor: '#546e7a',
              color: '#546e7a',
                '&:hover': {
                borderColor: '#455a64',
                backgroundColor: 'rgba(84, 110, 122, 0.1)',
                },
              }}
            >
            Camera
          </StyledButton>
        </Box>
      </Box>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Images ({selectedFiles.length})
          </Typography>
          
          <Grid container spacing={2}>
            {selectedFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ImageCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeFile(index)}
                      sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.8)' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </ImageCard>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={clearAll}
              sx={{ mr: 2 }}
            >
              Clear All
            </Button>
            
            <StyledButton
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <AddPhotoAlternateIcon />}
            >
              {isLoading ? 'Processing...' : `Process ${uploadMode === 'single' ? 'Image' : 'Images'}`}
            </StyledButton>
          </Box>
        </Box>
      )}

      {/* Prediction Results */}
      {predictionResults.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          
          {uploadMode === 'single' ? (
            <PredictionResult result={predictionResults[0]} />
          ) : (
            <Grid container spacing={2}>
              {predictionResults.map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={previewUrls[index]}
                      alt={`Result ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <PredictionResult result={result} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Camera Modal */}
      <Modal open={showCamera} onClose={handleCameraClose}>
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            Camera Capture
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Camera functionality will be implemented here. For now, please use file upload.
          </Typography>
          <Button onClick={handleCameraClose} variant="contained">
              Close
            </Button>
          </ModalContent>
        </Modal>
      </StyledPaper>
  );
};

export default ImageUploadForm;