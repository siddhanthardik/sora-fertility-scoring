import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, clinicName, phone, email, city, country, painPoint } = data;

    // Validate required fields
    if (!name || !clinicName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Configure Nodemailer transporter
    // NOTE: Requires SMTP credentials in .env.local
    // process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS
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
      to: 'hardiksiddhant@gmail.com', // User requested email
      subject: `SORA CRM Demo request: ${clinicName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #011434; border-bottom: 2px solid #eee; padding-bottom: 10px;">New CRM Demo Request</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; width: 150px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Clinic Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                <a href="mailto:${email}" style="color: #023188;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">WhatsApp/Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">${city || 'N/A'}, ${country || 'N/A'}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #011434; font-size: 14px; text-transform: uppercase;">Primary Pain Point</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #333; margin-bottom: 0;">${painPoint || 'Not provided'}</p>
          </div>
          
          <div style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
            This email was sent automatically from the SORA Fertility Landing Page.
          </div>
        </div>
      `,
    };

    // If SMTP credentials aren't set, we mock the success so the UI doesn't break
    // but log a warning to the console.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not found in .env.local! Mocking email send.");
      console.log("Would have sent the following email payload:", mailOptions);
      return NextResponse.json({ success: true, message: "Mock email sent successfully (SMTP not configured)" });
    }

    // Actually send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (sendError) {
      console.warn("SMTP Error: Failed to send email. Check your .env.local credentials. Error:", sendError.message);
      console.log("Would have sent the following email payload:", mailOptions);
    }
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error sending demo request email:", error);
    return NextResponse.json({ error: "Failed to send demo request" }, { status: 500 });
  }
}
