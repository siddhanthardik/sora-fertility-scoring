import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/app/lib/superadminAuth";
import { getPackages, createPackage } from "@/app/lib/settingsRegistry";

export async function GET() {
  try {
    await requireSuperadmin();
    const packages = await getPackages();
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireSuperadmin();
    const body = await request.json();
    const newPackage = await createPackage(body);
    return NextResponse.json({ success: true, package: newPackage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// force reload
