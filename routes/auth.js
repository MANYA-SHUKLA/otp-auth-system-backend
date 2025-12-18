const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
require('dotenv').config();
router.post('/send-otp', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            if (!name) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Name is required for new users',
                    requiresName: true  // Add this flag
                });
            }
            
            user = new User({ 
                name: name.trim(),
                email: email.toLowerCase().trim()
            });
            await user.save();
            isNewUser = true;
        } else {
            // Existing user - use stored name
            isNewUser = !user.isVerified;
        }
        const otp = user.generateOTP();
        await user.save();
        const emailResult = await sendOTPEmail(email, user.name, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ 
                success: false, 
                message: `Failed to send OTP email: ${emailResult.error}`,
                error: emailResult.error
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            isNewUser: isNewUser
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists. Please use a different email.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        const isValid = user.verifyOTP(otp);

        if (!isValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP' 
            });
        }

        await user.save();
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-otp -otpExpires');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;