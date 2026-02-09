import { NextRequest } from "next/server";
import { connectDB } from "@/lib/connectDB";
import EventsModel from "@/models/Events.Model";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    await connectDB();
    let query = {};
    if (type === "upcoming") {
      query = { status: "upcoming" };
    } else if (type === "past") {
      query = { status: "past" };
    }
    const events = await EventsModel.find(query).sort({ createdAt: -1 });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Events fetched successfully.",
        data: events,
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
  try {
    const body = await request.json();
    await connectDB();
    const { title, description } = body;
    if (!title || !description) {
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
    const newEvent = await EventsModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event created successfully.",
        data: newEvent,
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
  try {
    const body = await request.json();
    await connectDB();
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
    const deletedEvent = await EventsModel.findByIdAndDelete(_id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event deleted successfully.",
        data: deletedEvent,
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
  try {
    const body = await request.json();
    await connectDB();
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
    const updatedEvent = await EventsModel.findByIdAndUpdate(_id, rest);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event updated successfully.",
        data: updatedEvent,
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
