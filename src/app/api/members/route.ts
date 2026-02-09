import { connectDB } from "@/lib/connectDB";
import MembersModel from "@/models/Members.Model";
import { isAdmin } from "@/lib/isAdmin";

export async function GET(request: Request) {
  try {
    await connectDB();
    const members = await MembersModel.find();
    if (members.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No members found.",
        }),
        {
          status: 404,
        },
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Members fetched successfully.",
        data: members,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      {
        status: 500,
      },
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
    const body = await request.json();
    const { fullName, email, phone, discipline, batch, position, social } =
      body;
    if (!fullName || !email || !phone || !discipline || !batch || !position) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields.",
        }),
        {
          status: 400,
        },
      );
    }
    await connectDB();
    const newMember = await MembersModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Member created successfully.",
        data: newMember,
      }),
      {
        status: 201,
      },
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields.",
        }),
        {
          status: 400,
        },
      );
    }
    await connectDB();
    const deletedMember = await MembersModel.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Member deleted successfully.",
        data: deletedMember,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    const { _id, ...rest } = body;
    if (!_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields.",
        }),
        {
          status: 400,
        },
      );
    }
    await connectDB();
    const updatedMember = await MembersModel.findById(_id);
    if (!updatedMember) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Member not found.",
        }),
        {
          status: 404,
        },
      );
    }
    updatedMember.set(rest);
    await updatedMember.save();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Member updated successfully.",
        data: updatedMember,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      {
        status: 500,
      },
    );
  }
}
