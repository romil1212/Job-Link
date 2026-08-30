const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (toEmail, otp) => {
  // Always log to terminal as an instant backup
  console.log('\n=========================================');
  console.log(`🔐 OTP CODE FOR [${toEmail}]: ${otp}`);
  console.log('=========================================\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'ResumeVerify <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Your Verification Code - ResumeVerify',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 8px;">Verify Your Email</h2>
          <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 0;">Use this single-use code to complete your registration.</p>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 12px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0284c7;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend delivery error:', error);
      throw new Error(error.message);
    }

    console.log('Email successfully delivered to inbox:', data.id);
  } catch (err) {
    console.error('Email send failed:', err.message);
    throw err;
  }
};

module.exports = { sendOtpEmail };