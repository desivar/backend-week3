const express = require('express');
const router = express.Router();
const path = require('path');

// Enhanced Static File Serving
router.use(express.static(path.join(__dirname, '..', 'public'), {
  // Cache control for better performance
  maxAge: '1d',
  // Set proper Content-Type headers
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// Debugging route to verify static files are served
router.get('/debug-static', (req, res) => {
  res.json({
    staticPath: path.join(__dirname, '..', 'public'),
    files: {
      css: path.join(__dirname, '..', 'public', 'styles', 'styles.css'),
      images: path.join(__dirname, '..', 'public', 'images')
    }
  });
});

module.exports = router;

















