import { NextResponse } from "next/server";
import {
  clearSuperadminSession,
  requireSameOrigin,
  requireSuperadmin,
  setSuperadminSession,
  verifyPassword,
} from "../../../lib/superadminAuth";

export async function GET() {
  try {
    await requireSuperadmin();
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request) {
  const originCheck = authorizeSameOrigin(request);
  if (originCheck) return originCheck;

  const { password } = await request.json().catch(() => ({}));
  if (!verifyPassword(password || "")) {
    return NextResponse.json(
      { success: false, message: "Invalid superadmin password." },
      { status: 401 }
    );
  }

  try {
    await setSuperadminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Superadmin session is not configured." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const originCheck = authorizeSameOrigin(request);
  if (originCheck) return originCheck;

  await clearSuperadminSession();
  return NextResponse.json({ success: true });
}

function authorizeSameOrigin(request) {
  try {
    requireSameOrigin(request);
    return null;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }
}
