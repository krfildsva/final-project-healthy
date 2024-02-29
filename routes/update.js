const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Image = require('../models/Image');
const User = require('../models/user.js');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });
const isAuthenticated = (req, res, next) => {
  if (req.session.userId === "65d79696b6a2d2cdb21bd60b") {
      next();
  } else {
      res.status(500).send('Only admin can access');
      res.redirect('/login'); 
  }
};

router.get('/:id', isAuthenticated, async(req, res) => {
  const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.render('update', { title: 'Update', error: null, image: image });
});

router.post('/:id', upload.single('imageFile'), async (req, res) => {
    try {
      let update = {
        text: req.body.text,
      };
      
      if (req.body.imageUrl) {
        update.imageUrl = req.body.imageUrl;
      }

      if (req.body.naming) {
        update.naming = req.body.naming;
      }
  
      await Image.findByIdAndUpdate(req.params.id, update);
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error updating image:', error);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;
  