// API Configuration for the frontend
export const API_CONFIG = {
  // Base URL for the ML backend API
  // Use import.meta.env for Vite, fallback to hardcoded localhost
  BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000',
  
  // API Endpoints
  ENDPOINTS: {
    // Single image prediction
    PREDICT_SINGLE: '/predict',
    
    // Multiple image prediction
    PREDICT_MULTIPLE: '/predict_multiple',
    
    // Upload history with pagination
    UPLOAD_HISTORY: '/upload_history',
    
    // Model statistics
    MODEL_STATS: '/model_stats',
    
    // Health check
    HEALTH_CHECK: '/health',
    
    // Home endpoint
    HOME: '/',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  },
  
  // File upload configuration
  UPLOAD_CONFIG: {
    maxFileSize: 16 * 1024 * 1024, // 16MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'],
    maxFiles: 10, // Maximum number of files for multiple upload
  },
  
  // Pagination configuration
  PAGINATION: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get endpoint by key
export const getEndpoint = (key) => {
  return API_CONFIG.ENDPOINTS[key] || key;
};

export default API_CONFIG;
