# Pakistani Currency Detection Frontend

A modern, responsive React-based frontend application for detecting real vs fake Pakistani currency notes using advanced ML techniques.

## 🚀 Features

### Core Functionality
- **Single Image Upload**: Upload and process individual currency images
- **Multiple Image Upload**: Process multiple images simultaneously for batch analysis
- **Real-time Processing**: Get instant results with confidence scores and processing times
- **Camera Integration**: Capture images directly from device camera (coming soon)

### Enhanced UI/UX
- **Modern Design**: Material-UI based interface with beautiful gradients and animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive navigation
- **Progress Indicators**: Visual feedback during image processing

### Advanced Features
- **Upload History**: View all previous uploads with detailed results
- **Model Statistics**: Monitor model performance and prediction distribution
- **File Management**: Remove individual files, clear all, and manage uploads
- **Error Handling**: Comprehensive error messages and user guidance

## 🛠️ Technology Stack

- **React 19**: Latest React with modern hooks and features
- **Material-UI (MUI)**: Professional UI components and theming
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing and navigation
- **Vite**: Fast build tool and development server

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ImageUploadForm.jsx    # Main upload interface
│   ├── PredictionResult.jsx   # Result display component
│   ├── UploadHistory.jsx      # History and statistics
│   ├── Navbar.jsx             # Navigation component
│   ├── Layout.jsx             # Page layout wrapper
│   └── Instructions.jsx       # User instructions
├── pages/               # Page components
│   └── Home.jsx         # Homepage
├── config/              # Configuration files
│   └── api.js           # API endpoints and settings
├── assets/              # Static assets
└── theme.js             # Material-UI theme configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd ml-frontend/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Alternative: Use the batch file (Windows)
Double-click `start_frontend.bat` to automatically start the development server.

## 🔧 Configuration

### API Configuration
The frontend is configured to connect to the ML backend at `http://localhost:5000` by default. You can modify this in:

```javascript
// src/config/api.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  // ... other settings
};
```

### Environment Variables
Create a `.env` file in the frontend directory to customize settings:

```env
REACT_APP_API_URL=http://your-backend-url:5000
```

## 📱 Usage Guide

### 1. Single Image Upload
1. Navigate to the "Check Currency" page
2. Click "Browse Files" to select an image
3. Click "Process Image" to analyze
4. View results with confidence scores

### 2. Multiple Image Upload
1. Toggle to "Multiple Images" mode
2. Select multiple image files
3. Click "Process Images" for batch analysis
4. View individual results for each image

### 3. View History
1. Navigate to the "History" page
2. View upload statistics and model performance
3. Browse through previous uploads
4. Use pagination to navigate large datasets

### 4. Navigation
- **Home**: Landing page with overview
- **Instructions**: Detailed usage instructions
- **Check Currency**: Main upload interface
- **History**: Upload history and statistics

## 🎨 Customization

### Theme Customization
Modify `src/theme.js` to customize colors, typography, and component styles:

```javascript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2', // Custom primary color
    },
    // ... other theme options
  },
});
```

### Component Styling
All components use Material-UI's `styled` API for consistent styling. Modify the styled components in each file to customize appearance.

## 🔍 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure the ML backend is running on port 5000
   - Check firewall and network settings
   - Verify API endpoints in `src/config/api.js`

2. **Image Upload Issues**
   - Check file size (max 16MB)
   - Ensure file format is supported (JPG, PNG, GIF, BMP, TIFF)
   - Verify browser compatibility

3. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Update Node.js to latest LTS version
   - Check for conflicting package versions

### Performance Optimization
- Use image compression for large files
- Enable browser caching
- Optimize image formats (WebP for modern browsers)

## 📊 API Integration

The frontend communicates with the ML backend through these endpoints:

- `POST /predict` - Single image prediction
- `POST /predict_multiple` - Multiple image prediction
- `GET /upload_history` - Upload history with pagination
- `GET /model_stats` - Model performance statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Pakistani Currency Detection System.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section above
- Review the backend documentation
- Ensure all dependencies are properly installed

---

**Note**: This frontend requires the ML backend to be running for full functionality. Make sure both services are operational before testing.
