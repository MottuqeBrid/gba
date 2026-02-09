"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  status: "upcoming" | "past";
  upcomingEvents: boolean;
  eventDetails?: {
    date?: string;
    time?: string;
    location?: string;
  };
  contactDetails?: {
    phone?: string;
    email?: string;
  };
}

const categoryStyles: Record<string, string> = {
  Seminar: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  Workshop: "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]",
  Meetup: "bg-[var(--color-accent)]/20 text-[var(--color-accent)]",
  Cultural: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  Sports: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  Conference: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  Celebration: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  Other: "bg-base-300 text-base-content",
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      // Fetch only upcoming events
      const res = await fetch("/api/events?type=upcoming");
      const data = await res.json();
      if (data.success) {
        // Filter to get featured events (upcomingEvents flag) or just the first few
        const featured = data.data.filter((e: Event) => e.upcomingEvents);
        setEvents(featured.length > 0 ? featured : data.data.slice(0, 1));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextEvent = events[0];
  const hasEvents = events.length > 0;

  if (loading) {
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
            <div className="card bg-base-200 border border-primary rounded-xl p-6 sm:p-8 animate-pulse">
              <div className="w-full h-64 bg-base-300 rounded-xl mb-6"></div>
              <div className="h-8 bg-base-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-base-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                {nextEvent.image ? (
                  <Image
                    src={nextEvent.image}
                    alt={nextEvent.title}
                    width={500}
                    height={300}
                    placeholder="blur"
                    blurDataURL={nextEvent.image}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-base-300 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold opacity-50">
                      No Image
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 flex items-center justify-between left-0 w-full bg-base-200/50 p-2 backdrop-blur-sm rounded-b-xl">
                  <div className="">
                    <p className="text-sm sm:text-base font-bold text-white">
                      {nextEvent.eventDetails?.date
                        ? format(
                            new Date(nextEvent.eventDetails.date),
                            "MMM dd, yyyy",
                          )
                        : "Date TBA"}
                    </p>
                    <p className="text-sm text-white">
                      {nextEvent.eventDetails?.time || "Time TBA"}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-sm text-white">
                      {nextEvent.eventDetails?.location || "Location TBA"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="space-y-3">
                  {nextEvent.category && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        categoryStyles[nextEvent.category] ||
                        categoryStyles["Other"]
                      }`}
                    >
                      {nextEvent.category}
                    </span>
                  )}
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
                  <Link
                    href={`/events/${nextEvent._id}`}
                    className="btn btn-primary px-4 py-2 shadow-xl"
                  >
                    View Details
                  </Link>
                </div>

                <div className="w-full flex justify-between items-center flex-col sm:flex-row gap-3">
                  {nextEvent.contactDetails?.phone && (
                    <div className="flex gap-2 border-2 shadow-xl bg-base-200 border-primary p-2 rounded-xl hover:text-primary hover:bg-secondary transition-colors">
                      <p>Phone:</p>
                      <a href={`tel:${nextEvent.contactDetails.phone}`}>
                        {nextEvent.contactDetails.phone}
                      </a>
                    </div>
                  )}
                  {nextEvent.contactDetails?.email && (
                    <div className="flex gap-2 border-2 shadow-xl bg-base-200 border-primary p-2 rounded-xl hover:text-primary hover:bg-secondary transition-colors">
                      <p>Email:</p>
                      <a href={`mailto:${nextEvent.contactDetails.email}`}>
                        {nextEvent.contactDetails.email}
                      </a>
                    </div>
                  )}
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
