import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sora_superadmin";
const SESSION_AGE_SECONDS = 60 * 60 * 8;

export async function requireSuperadmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value || "";
  if (!isValidSessionToken(token)) {
    throw new Error("Unauthorized");
  }
}

export function requireSameOrigin(request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    try {
      if (new URL(origin).host !== host) throw new Error("Invalid request origin.");
    } catch {
      throw new Error("Invalid request origin.");
    }
    return;
  }

  if (referer) {
    try {
      if (new URL(referer).host !== host) throw new Error("Invalid request origin.");
    } catch {
      throw new Error("Invalid request origin.");
    }
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing request origin.");
  }
}

export async function setSuperadminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSuperadminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyPassword(password) {
  const configured = (process.env.SORA_SUPERADMIN_PASSWORD || "").trim();
  if (!configured) return false;
  return timingSafeEqual(password.trim(), configured);
}

function createSessionToken() {
  assertSessionSecret();
  const expires = Math.floor(Date.now() / 1000) + SESSION_AGE_SECONDS;
  const payload = `superadmin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function isValidSessionToken(token) {
  if (!hasSessionSecret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const expires = Number(parts[1]);
  if (parts[0] !== "superadmin" || !Number.isFinite(expires)) return false;
  if (expires < Math.floor(Date.now() / 1000)) return false;

  return timingSafeEqual(parts[2], sign(payload));
}

function sign(value) {
  const secret = getSessionSecret();
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function getSessionSecret() {
  return (process.env.SORA_SUPERADMIN_SESSION_SECRET || process.env.SORA_SUPERADMIN_PASSWORD || "").trim();
}

function hasSessionSecret() {
  return Boolean(getSessionSecret());
}

function assertSessionSecret() {
  if (!hasSessionSecret()) {
    throw new Error("Superadmin session secret is not configured.");
  }
}

function timingSafeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
