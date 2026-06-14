import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const { email, source = 'blog' } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email address." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check if email already exists
    const { data: existingUser } = await supabase
      .from("subscribers")
      .select("email, status")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      if (existingUser.status === 'active') {
        return NextResponse.json({ success: true, message: "You are already subscribed!" }, { status: 200 });
      } else {
        // Reactivate if they previously unsubscribed
        await supabase
          .from("subscribers")
          .update({ status: 'active' })
          .eq("email", email.toLowerCase());
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("subscribers")
        .insert([{ email: email.toLowerCase(), source, status: 'active' }]);

      if (insertError) {
        throw insertError;
      }
    }

    // 2. Send Welcome Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "SORA Fertility <hello@sorafertility.com>", // You must configure this domain in Resend
          to: email,
          subject: "Welcome to SORA Fertility \uD83D\uDC9C",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h1 style="color: #f43f5e;">Welcome to SORA!</h1>
              <p>Hi there,</p>
              <p>Thank you for subscribing to the SORA Fertility newsletter. We're thrilled to have you with us!</p>
              <p>You can expect the latest clinical insights, product updates, and fertility research delivered straight to your inbox.</p>
              <br/>
              <p>Best regards,<br/>The SORA Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend Email Error:", emailError);
        // We still return success because the user was saved to the DB
      }
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" }, { status: 200 });

  } catch (error) {
    console.error("Subscribe Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
