import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { buildApiUrl, getEndpoint, API_CONFIG } from '../config/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 'auto'),
  maxWidth: 1200,
  borderRadius: 15,
  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
}));

const StatCard = styled(Card)(() => ({
  height: '100%',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
  border: '1px solid rgba(84, 110, 122, 0.2)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const UploadHistory = () => {
  const [uploads, setUploads] = useState([]);
  const [modelStats, setModelStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(API_CONFIG.PAGINATION.defaultPageSize);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch upload history
      const historyResponse = await axios.get(
        buildApiUrl(getEndpoint('UPLOAD_HISTORY')), 
        {
          params: { page: page + 1, per_page: rowsPerPage },
          timeout: API_CONFIG.REQUEST_CONFIG.timeout,
        }
      );
      setUploads(historyResponse.data.uploads);
      
      // Fetch model statistics
      const statsResponse = await axios.get(
        buildApiUrl(getEndpoint('MODEL_STATS')),
        { timeout: API_CONFIG.REQUEST_CONFIG.timeout }
      );
      setModelStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 'real':
        return 'success';
      case 'fake':
        return 'error';
      case 'not_currency':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && !modelStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <StyledPaper elevation={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="primary">
          Upload History & Model Statistics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Model Statistics */}
      {modelStats && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Model Performance Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <StorageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Total Uploads
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {modelStats.total_uploads}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    All time uploads
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ScheduleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="success">
                      Today's Uploads
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {modelStats.uploads_today}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Uploads today
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="info">
                      Avg Processing
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {modelStats.average_processing_time}s
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average time per image
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="warning">
                      Model Status
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {modelStats.model_status === 'active' ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current model status
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>

          {/* Prediction Distribution */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Prediction Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(modelStats.predictions_distribution).map(([key, value]) => (
                <Grid item xs={12} sm={4} key={key}>
                  <Chip
                    label={`${key}: ${value}`}
                    color={getPredictionColor(key)}
                    variant="outlined"
                    sx={{ fontSize: '1rem', padding: 2 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Upload History Table */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Recent Uploads
        </Typography>
        
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(84, 110, 122, 0.1)' }}>
                <TableCell><strong>File</strong></TableCell>
                <TableCell><strong>Prediction</strong></TableCell>
                <TableCell><strong>Confidence</strong></TableCell>
                <TableCell><strong>Processing Time</strong></TableCell>
                <TableCell><strong>File Size</strong></TableCell>
                <TableCell><strong>Upload Time</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary" py={3}>
                      No uploads found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                uploads.map((upload) => (
                  <TableRow key={upload.id} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {upload.original_filename}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={upload.prediction_result || 'N/A'}
                        color={getPredictionColor(upload.prediction_result)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {upload.confidence_score ? `${(upload.confidence_score * 100).toFixed(1)}%` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {upload.processing_time ? `${upload.processing_time.toFixed(3)}s` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(upload.file_size)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(upload.upload_timestamp)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={API_CONFIG.PAGINATION.pageSizeOptions}
          component="div"
          count={uploads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </StyledPaper>
  );
};

export default UploadHistory;
