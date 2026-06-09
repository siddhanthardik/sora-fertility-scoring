import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseClient";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_placeholder";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const notes = payment.notes;
      
      if (notes && notes.clinic_id && notes.plan) {
        // Upgrade the plan in Supabase
        await supabaseAdmin
          .from("clinic_registry")
          .update({ plan: notes.plan })
          .eq("clinic_id", notes.clinic_id);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
