import { connectDB } from "@/lib/connectDB";
import CarouselModel from "@/models/Carousel.Model";

export async function GET(request: Request) {
  try {
    await connectDB();
    const carousels = await CarouselModel.find();
    return new Response(
      JSON.stringify({
        data: carousels,
        success: true,
        message: "Carousels fetched successfully.",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
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
    const { title, image } = body;
    if (!title || !image) {
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
    const newCarousel = await CarouselModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Carousel created successfully.",
        data: newCarousel,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
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
    const updatedCarousel = await CarouselModel.findByIdAndUpdate(_id, rest);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Carousel updated successfully.",
        data: updatedCarousel,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
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
    const deletedCarousel = await CarouselModel.findByIdAndDelete(_id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Carousel deleted successfully.",
        data: deletedCarousel,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
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
