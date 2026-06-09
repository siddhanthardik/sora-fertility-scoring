import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/app/lib/superadminAuth";
import { updatePackage } from "@/app/lib/settingsRegistry";

export async function PATCH(request, context) {
  try {
    await requireSuperadmin();
    const { id } = await context.params;
    const body = await request.json();
    
    const updated = await updatePackage(id, body);
    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
