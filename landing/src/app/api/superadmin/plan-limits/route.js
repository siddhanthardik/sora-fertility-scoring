import { NextResponse } from "next/server";
import { requireSuperadmin } from "../../../lib/superadminAuth";
import { getSettings, updateSettings } from "../../../lib/settingsRegistry";

export async function GET() {
  try {
    await requireSuperadmin();
    const settings = await getSettings();
    return NextResponse.json({ success: true, planLimits: settings.planLimits, widgetHostUrl: settings.widgetHostUrl });
  } catch {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireSuperadmin();
    
    const body = await request.json();
    if (!body.planLimits) {
      return NextResponse.json({ success: false, message: "Missing planLimits in request." }, { status: 400 });
    }

    const updated = await updateSettings({
      planLimits: body.planLimits,
      widgetHostUrl: body.widgetHostUrl
    });
    return NextResponse.json({ success: true, planLimits: updated.planLimits, widgetHostUrl: updated.widgetHostUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unauthorized or server error." }, { status: 401 });
  }
}
