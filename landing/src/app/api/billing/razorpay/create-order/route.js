import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/app/lib/supabaseClient";
import { getPackage } from "@/app/lib/settingsRegistry";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
});

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { plan } = body;

    const pkg = await getPackage(plan);
    
    if (!pkg) {
      return NextResponse.json({ success: false, message: "Invalid plan" }, { status: 400 });
    }

    const amount = pkg.price_inr;

    if (amount === 0) {
      // Free plan, just update DB
      await supabaseAdmin.from("clinic_registry").update({ plan: "starter" }).eq("clinic_id", clinicId);
      return NextResponse.json({ success: true, message: "Plan updated to Starter." });
    }

    // Create Razorpay Order
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${clinicId}_${Date.now()}`,
      notes: {
        clinic_id: clinicId,
        plan: plan,
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
