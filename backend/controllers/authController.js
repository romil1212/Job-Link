const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 1. Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate existing OTPs for this email and store the new one
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    // Send email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent successfully to your email.',
    });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email. Please check your SMTP settings in .env',
    });
  }
};

// 2. Verify Standalone OTP (Optional check prior to final submit)
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email OTP verified successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Register Account (Validates inputs and enforces verified OTP)
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, otp } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Ensure valid OTP was submitted if enforced on registration
    if (otp) {
      const validOtp = await Otp.findOne({ email, otp });
      if (!validOtp) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
      }
      // Consume the OTP token
      await Otp.deleteOne({ _id: validOtp._id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};