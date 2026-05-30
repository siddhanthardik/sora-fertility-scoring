import { NextResponse } from "next/server";
import { requireSuperadmin } from "../../../lib/superadminAuth";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    // Only allow if currently authenticated as superadmin
    await requireSuperadmin();

    const { newPassword } = await request.json().catch(() => ({}));
    
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), ".env.local");
    
    try {
      const content = await fs.readFile(envPath, "utf-8");
      
      // Replace the password line
      let newContent;
      if (content.includes("SORA_SUPERADMIN_PASSWORD=")) {
        newContent = content.replace(/^SORA_SUPERADMIN_PASSWORD=.*$/m, `SORA_SUPERADMIN_PASSWORD=${newPassword}`);
      } else {
        newContent = content + `\nSORA_SUPERADMIN_PASSWORD=${newPassword}\n`;
      }
      
      await fs.writeFile(envPath, newContent, "utf-8");
      
      return NextResponse.json({ success: true, message: "Password updated successfully." });
    } catch (fsError) {
      console.error("Failed to write to .env.local:", fsError);
      return NextResponse.json({ success: false, message: "Failed to save password to .env.local. File might be read-only." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }
}
