import { connectDB } from "@/lib/connectDB";
import AboutModel from "@/models/About.Model";

export async function GET() {
  try {
    await connectDB();
    // Get the first (and likely only) about document
    let about = await AboutModel.findOne();

    // If no about document exists, create a default one
    if (!about) {
      about = await AboutModel.create({
        organizationName: "Greater Bogura Association (GBA)",
        tagline: "Building Bridges, Creating Community",
        description:
          "Greater Bogura Association (GBA) at Khulna University is a vibrant community of students and alumni from the Bogura district, dedicated to fostering connections, cultural exchange, and mutual support among its members.",
        mission:
          "To create a supportive and inclusive community for students and alumni from Bogura, promoting academic excellence, cultural preservation, and professional development through various programs, events, and networking opportunities.",
        vision:
          "To be the leading association that empowers individuals from Bogura to achieve their full potential, while preserving our rich cultural heritage and contributing positively to society through education, unity, and service.",
        coreValues: [
          {
            title: "Unity",
            description:
              "Bringing together people from diverse backgrounds under one community.",
            icon: "FaUsers",
          },
          {
            title: "Compassion",
            description:
              "Supporting each other through challenges with empathy and care.",
            icon: "FaHeart",
          },
          {
            title: "Excellence",
            description:
              "Encouraging academic and professional achievement in all endeavors.",
            icon: "FaGraduationCap",
          },
          {
            title: "Integrity",
            description:
              "Upholding honesty and ethical standards in everything we do.",
            icon: "FaHandshake",
          },
        ],
        contactDetails: {
          address: {
            line1: "Greater Bogura Association (GBA)",
            line2: "Khulna University Campus",
            city: "Khulna",
            postalCode: "9208",
            country: "Bangladesh",
          },
          phones: ["+880 1700-000000", "+880 1800-000000"],
          emails: ["info@gbaku.org", "support@gbaku.org"],
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.6747813618584!2d89.53061871496288!3d22.80229098505953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff8540e8d8e3fb%3A0x5b7dccc6b0dfb9d8!2sKhulna%20University!5e0!3m2!1sen!2sbd!4v1644912345678!5m2!1sen!2sbd",
        },
        socialLinks: {
          facebook: "https://facebook.com/gbaku",
          twitter: "https://twitter.com/gbaku",
          instagram: "https://instagram.com/gbaku",
          linkedin: "https://linkedin.com/company/gbaku",
          youtube: "https://youtube.com/@gbaku",
        },
      });
    }

    return new Response(
      JSON.stringify({
        data: about,
        success: true,
        message: "About data fetched successfully.",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching about data:", error);
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

    // Find the existing about document or create one
    let about = await AboutModel.findOne();

    if (about) {
      about = await AboutModel.findByIdAndUpdate(about._id, body, {
        new: true,
      });
    } else {
      about = await AboutModel.create(body);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "About data updated successfully.",
        data: about,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating about data:", error);
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
