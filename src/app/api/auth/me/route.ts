import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 },
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    await connectDB();
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 },
      );
    }

    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid token" }),
      { status: 401 },
    );
  }
}
