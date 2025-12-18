const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend('re_T4iHgC1J_CTrirqXAGSVGRhUev88UsooU');

const sendOTPEmail = async (email, name, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Your OTP for Login',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Hello ${name},</h2>
                    <p style="font-size: 16px; color: #555;">
                        Your One-Time Password (OTP) for login is:
                    </p>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                color: white; 
                                padding: 20px; 
                                text-align: center; 
                                font-size: 32px; 
                                font-weight: bold; 
                                letter-spacing: 10px; 
                                border-radius: 10px; 
                                margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #777;">
                        This OTP is valid for 10 minutes. Please do not share it with anyone.
                    </p>
                    <p style="font-size: 14px; color: #777;">
                        If you didn't request this OTP, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        This is an automated message, please do not reply to this email.
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error };
        }

        console.log(`OTP email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail };