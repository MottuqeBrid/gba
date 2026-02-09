import { connectDB } from "@/lib/connectDB";
import MessageModel from "@/models/Message.Model";

export async function GET() {
  try {
    await connectDB();
    const messages = await MessageModel.find().sort({
      order: 1,
      createdAt: -1,
    });
    return new Response(
      JSON.stringify({
        data: messages,
        success: true,
        message: "Messages fetched successfully.",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(
      JSON.stringify({
        error,
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
  try {
    await connectDB();
    const body = await request.json();
    const { title, message } = body;
    if (!title || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Title and message are required.",
        }),
        {
          status: 400,
        },
      );
    }
    const newMessage = await MessageModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message created successfully.",
        data: newMessage,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(
      JSON.stringify({
        error,
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
  try {
    await connectDB();
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
    const updatedMessage = await MessageModel.findByIdAndUpdate(_id, rest, {
      new: true,
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message updated successfully.",
        data: updatedMessage,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating message:", error);
    return new Response(
      JSON.stringify({
        error,
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
  try {
    await connectDB();
    const body = await request.json();
    const { _id } = body;
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
    const deletedMessage = await MessageModel.findByIdAndDelete(_id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted successfully.",
        data: deletedMessage,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({
        error,
        success: false,
        message: "Internal server error.",
      }),
      {
        status: 500,
      },
    );
  }
}
