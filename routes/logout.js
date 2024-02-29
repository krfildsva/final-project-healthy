const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Destroy the user session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Clear the session cookie
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;
