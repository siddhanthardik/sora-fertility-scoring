import { NextResponse } from "next/server";
import { requireSuperadmin } from "../../../lib/superadminAuth";
import { getSettings, updateSettings } from "../../../lib/settingsRegistry";

export async function GET() {
  try {
    await requireSuperadmin();
    const settings = await getSettings();
    return NextResponse.json({ success: true, widgetHostUrl: settings.widgetHostUrl });
  } catch {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireSuperadmin();
    
    const body = await request.json();
    if (!body.widgetHostUrl) {
      return NextResponse.json({ success: false, message: "Missing widgetHostUrl in request." }, { status: 400 });
    }

    const updated = await updateSettings({
      widgetHostUrl: body.widgetHostUrl
    });
    return NextResponse.json({ success: true, widgetHostUrl: updated.widgetHostUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unauthorized or server error." }, { status: 401 });
  }
}
