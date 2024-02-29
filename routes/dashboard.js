const express = require('express');
const router = express.Router();
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(500).send('Internal Server Error');
        //res.redirect('/login'); 
    }
};
const User = require('../models/User.js');
const Image = require('../models/Image.js');


router.get('/', isAuthenticated, async(req, res) => {
    const user = await User.findById(req.session.userId);
        if (user) {
            try {
                const images = await Image.find();
            res.render('dashboard', { title: 'Dashboard', user: user.first_name, images: images });
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).send('Internal Server Error');
        }
        }
});

module.exports = router;
