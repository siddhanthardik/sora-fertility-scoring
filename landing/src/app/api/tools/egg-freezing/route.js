import { NextResponse } from "next/server";
import { generateEggFreezingPDF } from "../../../lib/eggFreezingPdfGenerator";
import { Resend } from "resend";

export async function POST(req) {
  try {
    const { results, email, options } = await req.json();

    const pdfBuffer = await generateEggFreezingPDF(results, options || {});

    // If an email is provided, send it via Resend
    if (email) {
      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
      }
      
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'SORA Fertility <hello@sorafertility.com>',
        to: email,
        subject: 'Your SORA Egg Freezing Planner Report™',
        html: '<p>Hi there,</p><p>Attached is your personalized Egg Freezing Planner Report™ from SORA Fertility.</p><p>This educational guide includes your planning snapshot, timeline, estimated costs, and questions to ask a specialist.</p><p>Warmly,<br/>The SORA Team</p>',
        attachments: [
          {
            filename: 'SORA_Egg_Freezing_Planner.pdf',
            content: pdfBuffer,
          },
        ],
      });

      return NextResponse.json({ success: true, message: "Email sent successfully" });
    }

    // Otherwise, return the PDF as a downloadable blob
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="SORA_Egg_Freezing_Planner.pdf"',
      },
    });

  } catch (error) {
    console.error("Egg Freezing PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
