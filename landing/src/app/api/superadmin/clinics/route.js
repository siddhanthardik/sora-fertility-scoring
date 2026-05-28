import { NextResponse } from "next/server";
import { createClinic, listClinics, summarizeClinics } from "../../../lib/clinicRegistry";
import { requireSameOrigin, requireSuperadmin } from "../../../lib/superadminAuth";

export async function GET() {
  const auth = await authorize();
  if (auth) return auth;

  try {
    const clinics = await listClinics();
    return NextResponse.json({
      success: true,
      summary: summarizeClinics(clinics),
      clinics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not load clinics." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await authorize();
  if (auth) return auth;
  const originCheck = authorizeSameOrigin(request);
  if (originCheck) return originCheck;

  try {
    const payload = await request.json();
    const clinic = await createClinic(payload);
    return NextResponse.json({ success: true, clinic }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not create clinic." },
      { status: 400 }
    );
  }
}

function authorizeSameOrigin(request) {
  try {
    requireSameOrigin(request);
    return null;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
}

async function authorize() {
  try {
    await requireSuperadmin();
    return null;
  } catch {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
