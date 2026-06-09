import { NextResponse } from "next/server";
import { getPackages } from "@/app/lib/settingsRegistry";

export async function GET() {
  try {
    const packages = await getPackages();
    // Only return active packages
    const activePackages = packages.filter(p => p.is_active !== false);
    return NextResponse.json({ success: true, packages: activePackages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
