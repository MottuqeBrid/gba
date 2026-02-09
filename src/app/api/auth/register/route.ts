import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, email, phone, discipline, batch, password } = body;

    // Validation
    if (!fullName || !email || !phone || !discipline || !batch || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
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
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful",
        data: { id: newUser._id, email: newUser.email },
      }),
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500 },
    );
  }
}
