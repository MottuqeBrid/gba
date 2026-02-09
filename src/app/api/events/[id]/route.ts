import { NextRequest } from "next/server";
import { connectDB } from "@/lib/connectDB";
import EventsModel from "@/models/Events.Model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const event = await EventsModel.findById(id);

    if (!event) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Event not found.",
        }),
        { status: 404 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event fetched successfully.",
        data: event,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      { status: 500 },
    );
  }
}
