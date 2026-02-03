interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: "Seminar" | "Workshop" | "Meetup" | "Cultural" | "Sports";
  description: string;
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
    <section className="w-full bg-[var(--bg-primary)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Upcoming Events
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Stay connected with GBA
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl">
              Explore our latest gatherings, seminars, and activities designed
              to strengthen our community.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {!hasEvents ? (
            <div className="card bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 text-center">
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                No upcoming events
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Please check back soon for new announcements.
              </p>
            </div>
          ) : (
            <article className="card bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      categoryStyles[nextEvent.category]
                    }`}
                  >
                    {nextEvent.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                    {nextEvent.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {nextEvent.description}
                  </p>
                </div>
                <div className="space-y-2 text-left sm:text-right">
                  <p className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                    {nextEvent.date}
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {nextEvent.time}
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {nextEvent.location}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]"></span>
                  <span>Next upcoming event</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="btn btn-outline border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white">
                    Show All Events
                  </button>
                  <button className="btn btn-primary px-4 py-2">
                    Register
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
