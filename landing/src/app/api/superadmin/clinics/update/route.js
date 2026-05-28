import { NextResponse } from "next/server";
import { updateClinic } from "../../../../lib/clinicRegistry";
import { requireSameOrigin, requireSuperadmin } from "../../../../lib/superadminAuth";

export async function PATCH(request) {
  const auth = await authorize();
  if (auth) return auth;
  const originCheck = authorizeSameOrigin(request);
  if (originCheck) return originCheck;

  try {
    const payload = await request.json();
    const clinic = await updateClinic(payload.clinicId, payload.patch || {});
    if (!clinic) {
      return NextResponse.json(
        { success: false, message: "Clinic not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, clinic });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not update clinic." },
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
