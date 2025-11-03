import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ResultCard = styled(Paper)(({ theme, resultType }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `2px solid ${
    resultType === 'real' ? '#4caf50' : 
    resultType === 'fake' ? '#f44336' : 
    '#ff9800'
  }`,
  background: `linear-gradient(135deg, ${
    resultType === 'real' ? '#e8f5e8 0%, #c8e6c9 100%' : 
    resultType === 'fake' ? '#ffebee 0%, #ffcdd2 100%' : 
    '#fff3e0 0%, #ffe0b2 100%'
  })`,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const ConfidenceBar = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const PredictionResult = ({ result }) => {
  if (!result) {
    return (
      <Box textAlign="center" py={2}>
        <Typography variant="body2" color="textSecondary">
          No prediction result available
        </Typography>
      </Box>
    );
  }

  // Determine result type and styling
  const getResultType = (label) => {
    if (label === 'real') return 'real';
    if (label === 'fake') return 'fake';
    return 'not_currency';
  };

  const getResultIcon = (label) => {
    if (label === 'real') return '✅';
    if (label === 'fake') return '❌';
    return '🚫';
  };

  const getResultColor = (label) => {
    if (label === 'real') return 'success';
    if (label === 'fake') return 'error';
    return 'warning';
  };

  const getResultText = (label) => {
    if (label === 'real') return 'Real Currency';
    if (label === 'fake') return 'Fake Currency';
    return 'Not a Currency';
  };

  const resultType = getResultType(result.label);
  const confidence = result.confidence || 0;
  const processingTime = result.processing_time || 0;

  return (
    <ResultCard resultType={resultType} elevation={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="h3" fontWeight="bold">
          {getResultIcon(result.label)} {getResultText(result.label)}
        </Typography>
        <Chip
          label={`${(confidence * 100).toFixed(1)}%`}
          color={getResultColor(result.label)}
          variant="filled"
          size="small"
        />
      </Box>

      {/* Confidence Bar */}
      <ConfidenceBar>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="caption" color="textSecondary">
            Confidence Level
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {confidence.toFixed(3)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={confidence * 100}
          color={getResultColor(result.label)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}
        />
      </ConfidenceBar>

      {/* Processing Time */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="caption" color="textSecondary">
          Processing Time
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {processingTime.toFixed(3)}s
        </Typography>
      </Box>

      {/* File Information */}
      {result.filename && (
        <Box mt={2} p={1} bgcolor="rgba(0,0,0,0.05)" borderRadius={1}>
          <Typography variant="caption" color="textSecondary" display="block">
            File: {result.filename}
          </Typography>
          {result.upload_id && (
            <Typography variant="caption" color="textSecondary" display="block">
              ID: {result.upload_id}
            </Typography>
          )}
        </Box>
      )}

      {/* Status for multiple uploads */}
      {result.status && (
        <Box mt={1}>
          <Chip
            label={result.status === 'success' ? 'Success' : 'Failed'}
            color={result.status === 'success' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        </Box>
      )}

      {/* Error message if any */}
      {result.error && (
        <Box mt={1}>
          <Typography variant="caption" color="error">
            Error: {result.error}
          </Typography>
        </Box>
      )}
    </ResultCard>
  );
};

export default PredictionResult;