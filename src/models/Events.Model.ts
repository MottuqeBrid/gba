import mongoose from "mongoose";

const EventsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    upcomingEvents: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    status: {
      type: String,
      enum: ["upcoming", "past"],
      default: "upcoming",
    },
    guest: {
      chiefGuest: {
        name: {
          type: String,
        },
        image: {
          type: String,
        },
        description: {
          type: String,
        },
      },
      specialGuest: {
        name: {
          type: String,
        },
        image: {
          type: String,
        },
        description: {
          type: String,
        },
      },
      chairperson: {
        name: {
          type: String,
        },
        image: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    },
    eventAgenda: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
    eventDetails: {
      date: {
        type: Date,
      },
      time: {
        type: String,
      },
      location: {
        type: String,
      },
    },
    about: {
      type: String,
    },
    contactDetails: {
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true },
);

const Events = mongoose.model("Events", EventsSchema);

export default Events;
