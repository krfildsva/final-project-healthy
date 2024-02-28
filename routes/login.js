const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

router.get('/', (req, res) => {
    res.render('login', { title: 'Login', error: null });
});

const sendNotificationEmail = (email, action) => {
    const mailOptions = {
        from: '220141@astanait.edu.kz',
        to: email,
        subject: 'Notification: Action on Our Website',
        text: `You have performed the following action on our website: ${action}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending notification email:', error);
        } else {
            console.log('Notification email sent:', info.response);
        }
    });
};

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { title: 'Login', error: 'Invalid Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', { title: 'Login', error: 'Invalid Email or Password' });
        }

        req.session.userId = user._id;
        sendNotificationEmail(email, 'New Login')
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
