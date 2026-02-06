import Image from "next/image";
import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: "Seminar" | "Workshop" | "Meetup" | "Cultural" | "Sports";
  description: string;
  registration: {
    last_date: string;
    link: string;
    registration_over: boolean;
  };
  contact: {
    phone: string;
    email: string;
  };
  tags: string[];
}

const events: EventItem[] = [
  {
    id: "1",
    title: "Annual General Meeting",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop",
    date: "Mar 15, 2026",
    time: "10:00 AM",
    location: "KU Auditorium",
    category: "Meetup",
    description:
      "Gathering of members to review milestones and set goals for the year.",
    registration: {
      registration_over: false,
      last_date: "Mar 15, 2026",
      link: "https://example.com/register",
    },
    contact: {
      phone: "123-456-7890",
      email: "contact@example.com",
    },
    tags: ["Seminar", "Meetup"],
  },
];

const categoryStyles: Record<EventItem["category"], string> = {
  Seminar: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  Workshop: "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]",
  Meetup: "bg-[var(--color-accent)]/20 text-[var(--color-accent)]",
  Cultural: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  Sports: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
};

export default function UpcomingEvents() {
  const nextEvent = events[0];
  const hasEvents = events.length > 0;

  return (
    <section className="w-full py-12 sm:py-16">
      <div className="">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 flex flex-col items-center gap-4 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Our Upcoming Events
            </h2>
            <p className="text-base opacity-80">
              Explore our latest gatherings, seminars, and activities designed
              to strengthen our community.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {!hasEvents ? (
            <div className="card bg-base-200 border border-primary rounded-xl p-8 text-center">
              <p className="text-xl font-semibold text-primary">
                No upcoming events
              </p>
              <p className="mt-2 text-base opacity-80">
                Please check back soon for new announcements.
              </p>
            </div>
          ) : (
            <article className="card bg-base-200 border border-primary rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 w-full h-fit relative">
                <Image
                  src={nextEvent.image}
                  alt={nextEvent.title}
                  width={500}
                  height={300}
                  className="w-full rounded-xl"
                />
                <div className="absolute bottom-0 flex items-center justify-between left-0 w-full bg-base-200/50 p-2">
                  <div className="">
                    <p className="text-sm sm:text-base font-bold text-white">
                      {nextEvent.date}
                    </p>
                    <p className="text-sm text-white">{nextEvent.time}</p>
                  </div>
                  <div className="">
                    <p className="text-sm text-white">{nextEvent.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="space-y-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      categoryStyles[nextEvent.category]
                    }`}
                  >
                    {nextEvent.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-primary">
                    {nextEvent.title}
                  </h3>
                  <p className="text-base opacity-80 leading-relaxed">
                    {nextEvent.description}
                  </p>
                </div>
              </div>

              <div className="mb-3 mt-6 flex flex-col gap-6">
                <div className="flex justify-center items-center w-full gap-3">
                  <a
                    href={`/events/${nextEvent.id}`}
                    rel="noopener noreferrer"
                    className="btn btn-primary px-4 py-2 shadow-xl"
                  >
                    View Details
                  </a>
                  {!nextEvent.registration.registration_over && (
                    <a
                      href={nextEvent.registration.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary px-4 py-2 shadow-xl"
                    >
                      Register
                    </a>
                  )}
                </div>

                <div className="w-full flex justify-between items-center flex-col sm:flex-row gap-3">
                  {nextEvent.contact.phone && (
                    <div className="flex gap-2 border-2 shadow-xl bg-base-200 border-primary p-2 rounded-xl hover:text-primary hover:bg-secondary transition-colors">
                      <p>Phone:</p>
                      <a href={`tel:${nextEvent.contact.phone}`}>
                        {nextEvent.contact.phone}
                      </a>
                    </div>
                  )}
                  {nextEvent.contact.email && (
                    <div className="flex gap-2 border-2 shadow-xl bg-base-200 border-primary p-2 rounded-xl hover:text-primary hover:bg-secondary transition-colors">
                      <p>Email:</p>
                      <a href={`mailto:${nextEvent.contact.email}`}>
                        {nextEvent.contact.email}
                      </a>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-center items-center">
                  <p>
                    Our registration is open until{" "}
                    {nextEvent.registration.last_date}
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href="/events"
          className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
        >
          Show All Events
        </Link>
      </div>
    </section>
  );
}
