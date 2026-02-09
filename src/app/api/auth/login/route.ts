import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email or password",
        }),
        { status: 401 },
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email or password",
        }),
        { status: 401 },
      );
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        verified: user.verified,
      },
      process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
      { expiresIn: "1d" },
    );

    // Set Cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
      }),
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      },
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500 },
    );
  }
}
