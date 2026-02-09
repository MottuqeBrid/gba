import { connectDB } from "@/lib/connectDB";
import ContactModel from "@/models/Contact.Model";

export async function GET() {
  try {
    await connectDB();
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    return new Response(
      JSON.stringify({
        data: contacts,
        success: true,
        message: "Contacts fetched successfully.",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
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
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required.",
        }),
        {
          status: 400,
        },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email address.",
        }),
        {
          status: 400,
        },
      );
    }

    const newContact = await ContactModel.create(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully! We will get back to you soon.",
        data: newContact,
      }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating contact:", error);
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
          message: "Contact ID is required.",
        }),
        {
          status: 400,
        },
      );
    }

    const updatedContact = await ContactModel.findByIdAndUpdate(_id, rest, {
      new: true,
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact updated successfully.",
        data: updatedContact,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating contact:", error);
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
          message: "Contact ID is required.",
        }),
        {
          status: 400,
        },
      );
    }

    const deletedContact = await ContactModel.findByIdAndDelete(_id);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact deleted successfully.",
        data: deletedContact,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting contact:", error);
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
