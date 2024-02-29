const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Image = require('../models/Image.js');

const router = express.Router();
const upload = multer({ dest: 'temp/' });

const isAuthenticated = (req, res, next) => {
  if (req.session.userId === "65d79696b6a2d2cdb21bd60b") {
      next();
  } else {
      res.status(500).send('Only admin can access');
      //res.redirect('/login'); 
  }
};


cloudinary.config({ 
    cloud_name: process.env.cloud_name_secret, 
    api_key: process.env.cloud_key, 
    api_secret: process.env.cloud_secret
  });

router.get('/', isAuthenticated, (req, res) => {
    res.render('upload', { title: 'Upload', error: null });
});

// Routes
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const newImage = new Image({
        imageUrl: result.secure_url,
        naming: req.body.naming,
        text: req.body.text, 
      });
      await newImage.save();
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Server error');
    }
  });



module.exports = router;
