import { connectDB } from "@/lib/connectDB";
import User from "@/models/User.Model";
import { isAdmin } from "@/lib/isAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200 },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 },
    );
  }
}
