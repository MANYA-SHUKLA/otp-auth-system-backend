const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, name, otp) => {
    try {
        console.log('=================================================');
        console.log(`DEVELOPMENT MODE - OTP for ${email}: ${otp}`);
        console.log('=================================================');

        const { data, error } = await resend.emails.send({
            from: "VKRM OTP <no-reply@vkrmmanufacturers.in>",
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
            if (process.env.NODE_ENV !== 'production') {
                console.log('Dev Mode: Treating email failure as success. Use console OTP.');
                return { success: true };
            }
            return { success: false, error: error };
        }

        console.log(`OTP email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Dev Mode: Treating email failure as success. Use console OTP.');
            return { success: true };
        }
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail };