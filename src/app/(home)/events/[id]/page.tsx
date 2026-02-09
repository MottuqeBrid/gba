import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaUser,
} from "react-icons/fa";

interface Guest {
  name?: string;
  image?: string;
  description?: string;
}

interface AgendaItem {
  title?: string;
  description?: string;
  time?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  status: "upcoming" | "past";
  upcomingEvents: boolean;
  about?: string;
  tags?: string[];
  eventDetails?: {
    date?: string;
    time?: string;
    location?: string;
  };
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  guest?: {
    chiefGuest?: Guest;
    specialGuest?: Guest;
    chairperson?: Guest;
  };
  eventAgenda?: AgendaItem[];
  createdAt: string;
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-lg opacity-70 mb-8">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link href="/events" className="btn btn-primary">
          <FaArrowLeft className="mr-2" /> Back to Events
        </Link>
      </div>
    );
  }

  const hasGuests =
    event.guest?.chiefGuest?.name ||
    event.guest?.specialGuest?.name ||
    event.guest?.chairperson?.name;

  const hasAgenda = event.eventAgenda && event.eventAgenda.length > 0;

  return (
    <div className="min-h-screen bg-base-100 pb-16">
      {/* Hero Section with Event Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-base-300">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-neutral-focus flex items-center justify-center">
            <span className="text-4xl font-bold text-neutral-content opacity-50">
              No Image
            </span>
          </div>
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-gradient-to-t from-base-100 via-transparent to-transparent"></div>

        {/* Back Button */}
        <Link
          href="/events"
          className="absolute top-4 left-4 md:top-8 md:left-8 btn btn-ghost btn-sm md:btn-md bg-base-100/80 hover:bg-base-100 backdrop-blur-sm"
        >
          <FaArrowLeft /> Back
        </Link>

        {/* Category & Status Badges */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2">
          {event.category && (
            <div className="badge badge-secondary badge-lg shadow-md font-semibold">
              {event.category}
            </div>
          )}
          <div
            className={`badge badge-lg shadow-md font-semibold ${
              event.status === "upcoming" ? "badge-success" : "badge-ghost"
            }`}
          >
            {event.status}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="bg-base-100 rounded-xl shadow-2xl p-6 md:p-10">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>

          {/* Meta Details Row */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-base-content/70 mb-8 border-b border-base-200 pb-6">
            {event.eventDetails?.date && (
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <span>
                  {format(new Date(event.eventDetails.date), "MMMM dd, yyyy")}
                </span>
              </div>
            )}
            {event.eventDetails?.time && (
              <div className="flex items-center gap-2">
                <FaClock className="text-primary" />
                <span>{event.eventDetails.time}</span>
              </div>
            )}
            {event.eventDetails?.location && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" />
                <span>{event.eventDetails.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="badge badge-outline badge-md flex gap-1 items-center"
                >
                  <FaTag size={10} /> {tag}
                </div>
              ))}
            </div>
          )}

          {/* Description & About */}
          <div className="prose max-w-none mb-10">
            <h2 className="text-2xl font-bold mb-3">About the Event</h2>
            <p className="text-lg leading-relaxed">{event.description}</p>
            {event.about && (
              <p className="text-base leading-relaxed mt-4">{event.about}</p>
            )}
          </div>

          {/* Contact Details */}
          {(event.contactDetails?.phone ||
            event.contactDetails?.email ||
            event.contactDetails?.address) && (
            <div className="bg-base-200 rounded-lg p-6 mb-10">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.contactDetails.phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-content p-3 rounded-full">
                      <FaPhone />
                    </div>
                    <span>{event.contactDetails.phone}</span>
                  </div>
                )}
                {event.contactDetails.email && (
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary text-secondary-content p-3 rounded-full">
                      <FaEnvelope />
                    </div>
                    <span>{event.contactDetails.email}</span>
                  </div>
                )}
                {event.contactDetails.address && (
                  <div className="flex items-center gap-3">
                    <div className="bg-accent text-accent-content p-3 rounded-full">
                      <FaHome />
                    </div>
                    <span>{event.contactDetails.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guests Section */}
          {hasGuests && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Special Guests</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chief Guest */}
                {event.guest?.chiefGuest?.name && (
                  <div className="card bg-base-200 shadow-md">
                    <figure className="relative h-48 bg-base-300">
                      {event.guest.chiefGuest.image ? (
                        <Image
                          src={event.guest.chiefGuest.image}
                          alt={event.guest.chiefGuest.name}
                          width={500}
                          height={500}
                          placeholder="blur"
                          blurDataURL={event.guest.chiefGuest.image}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                          <FaUser />
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-4">
                      <span className="badge badge-primary badge-sm mb-1">
                        Chief Guest
                      </span>
                      <h3 className="card-title text-lg">
                        {event.guest.chiefGuest.name}
                      </h3>
                      {event.guest.chiefGuest.description && (
                        <p className="text-sm opacity-70 line-clamp-3">
                          {event.guest.chiefGuest.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Guest */}
                {event.guest?.specialGuest?.name && (
                  <div className="card bg-base-200 shadow-md">
                    <figure className="relative h-48 bg-base-300">
                      {event.guest.specialGuest.image ? (
                        <Image
                          src={event.guest.specialGuest.image}
                          alt={event.guest.specialGuest.name}
                          width={500}
                          height={500}
                          placeholder="blur"
                          blurDataURL={event.guest.specialGuest.image}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                          <FaUser />
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-4">
                      <span className="badge badge-secondary badge-sm mb-1">
                        Special Guest
                      </span>
                      <h3 className="card-title text-lg">
                        {event.guest.specialGuest.name}
                      </h3>
                      {event.guest.specialGuest.description && (
                        <p className="text-sm opacity-70 line-clamp-3">
                          {event.guest.specialGuest.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Chairperson */}
                {event.guest?.chairperson?.name && (
                  <div className="card bg-base-200 shadow-md">
                    <figure className="relative h-48 bg-base-300">
                      {event.guest.chairperson.image ? (
                        <Image
                          src={event.guest.chairperson.image}
                          alt={event.guest.chairperson.name}
                          width={500}
                          height={500}
                          placeholder="blur"
                          blurDataURL={event.guest.chairperson.image}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                          <FaUser />
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-4">
                      <span className="badge badge-accent badge-sm mb-1">
                        Chairperson
                      </span>
                      <h3 className="card-title text-lg">
                        {event.guest.chairperson.name}
                      </h3>
                      {event.guest.chairperson.description && (
                        <p className="text-sm opacity-70 line-clamp-3">
                          {event.guest.chairperson.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agenda Section */}
          {hasAgenda && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Event Agenda</h2>
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                {event.eventAgenda?.map((item, idx) => (
                  <li key={idx}>
                    {idx !== 0 && <hr className="bg-primary" />}
                    <div className="timeline-middle">
                      <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                    </div>
                    <div
                      className={`timeline-${
                        idx % 2 === 0 ? "start" : "end"
                      } md:text-${idx % 2 === 0 ? "end" : "start"} mb-10`}
                    >
                      <time className="font-mono text-sm italic opacity-60">
                        {item.time || "TBA"}
                      </time>
                      <div className="text-lg font-bold">{item.title}</div>
                      {item.description && (
                        <p className="text-sm opacity-70">{item.description}</p>
                      )}
                    </div>
                    {idx !== (event.eventAgenda?.length ?? 0) - 1 && (
                      <hr className="bg-primary" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
