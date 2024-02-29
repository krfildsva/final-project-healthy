const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', 
    port: 587, 
    secure: false, 
    auth: {
        user: '220141@astanait.edu.kz',
        pass: 'Sl4EwwowypD2X'
    }
});

const sendWelcomeEmail = (email) => {
    const mailOptions = {
        from: '220141@astanait.edu.kz',
        to: email,
        subject: 'Welcome to Our Website!',
        text: 'Thank you for registering on our website. We are excited to have you as a member!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending welcome email:', error);
        } else {
            console.log('Welcome email sent:', info.response);
        }
    });
};

router.get('/', (req, res) => {
    res.render('signup', { title: 'Sign Up', emailError: null, passError: null });
});

router.post('/', async (req, res) => {
    const { email, password, username, first_name, last_name, age, country, gender } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', {
                emailError: 'Email already exists',
                title: 'Sign Up',
                passError: null
            });
        }
        if (password.length < 8) {
            return res.render('signup', {
                title: 'Sign Up',
                passError: 'Password must be at least 8 characters long',
                emailError: null
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, password: hashedPassword, username, first_name, last_name, age, country, gender });
        await newUser.save();
        sendWelcomeEmail(email);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
