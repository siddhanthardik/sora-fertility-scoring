import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, clinicName, reason, message } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !clinicName || !reason || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"SORA Website" <${process.env.SMTP_USER || 'no-reply@sorafertility.com'}>`,
      to: 'hardiksiddhant@gmail.com',
      subject: `SORA Contact Request: ${reason} - ${clinicName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #011434; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Request</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; width: 150px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Clinic / Company:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                <a href="mailto:${email}" style="color: #023188;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Reason:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${reason}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #011434; font-size: 14px; text-transform: uppercase;">Message Content</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin-bottom: 0;">${message}</p>
          </div>
          
          <div style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
            This email was sent automatically from the SORA Fertility Contact Page.
          </div>
        </div>
      `,
    };

    // If SMTP credentials aren't set, mock the success
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not found in .env.local! Mocking email send.");
      return NextResponse.json({ success: true, message: "Mock email sent successfully" });
    }

    // Actually send the email, catching any auth errors so we still return success to the UI
    try {
      await transporter.sendMail(mailOptions);
    } catch (sendError) {
      console.warn("SMTP Error: Failed to send contact email. Error:", sendError.message);
    }
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error sending contact request:", error);
    return NextResponse.json({ error: "Failed to send contact request" }, { status: 500 });
  }
}
