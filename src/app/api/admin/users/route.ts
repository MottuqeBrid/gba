import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
);

async function isAdmin() {
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

export async function GET() {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: users }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      discipline,
      batch,
      password,
      role,
      status,
      verified,
    } = body;

    // Validation
    if (!fullName || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name, Email and Password are required",
        }),
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists",
        }),
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      phone,
      discipline,
      batch,
      password: hashedPassword,
      role: role || "member",
      status: status || "active",
      verified: verified || false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        data: newUser,
      }),
      { status: 201 },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}
