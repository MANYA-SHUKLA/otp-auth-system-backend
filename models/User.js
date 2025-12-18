const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};
userSchema.methods.verifyOTP = function(enteredOTP) {
    if (this.otp === enteredOTP && this.otpExpires > Date.now()) {
        this.otp = null;
        this.otpExpires = null;
        this.isVerified = true;
        return true;
    }
    return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;