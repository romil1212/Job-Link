const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  sendOtp, 
  verifyOtp 
} = require('../controllers/authController');

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// Email OTP verification routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;