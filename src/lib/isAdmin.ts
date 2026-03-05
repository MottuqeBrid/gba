import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
);

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch (error) {
    return false;
  }
}
