import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
);

export async function PATCH(request: Request) {
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
    const body = await request.json();

    // Prevent sensitivity field updates via this route (role, email etc)
    const { role, email, password, ...allowedUpdates } = body;

    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      { $set: allowedUpdates },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 },
      );
    }

    return new Response(JSON.stringify({ success: true, data: updatedUser }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}
