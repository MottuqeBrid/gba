import { connectDB } from "@/lib/connectDB";
import GalleryModel from "@/models/Gallery.Model";

export async function GET(request: Request) {
  try {
    await connectDB();
    const gallery = await GalleryModel.find().sort({ createdAt: -1 });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gallery fetched successfully.",
        data: gallery,
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
    const { title, category, description, image } = body;
    if (!image) {
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
    const newGallery = await GalleryModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gallery created successfully.",
        data: newGallery,
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
    const deletedGallery = await GalleryModel.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gallery deleted successfully.",
        data: deletedGallery,
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
    const updatedGallery = await GalleryModel.findByIdAndUpdate(_id, rest);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gallery updated successfully.",
        data: updatedGallery,
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
