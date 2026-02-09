"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Message {
  _id: string;
  title: string;
  message: string;
  image?: string;
  role: string;
  personName?: string;
  isFeatured: boolean;
  order: number;
}

export const generateMetadata = (message: Message) => {
  return {
    title: `${message.title} | Messages`,
    description: message.message.substring(0, 160),
    openGraph: {
      title: message.title,
      description: message.message.substring(0, 160),
      images: message.image ? [{ url: message.image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: message.title,
      description: message.message.substring(0, 160),
      images: message.image ? [message.image] : [],
    },
  };
};

export default function MessagesSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get featured message (first one marked as featured, or first message)
  const featuredMessage = messages.find((m) => m.isFeatured) || messages[0];
  // Get other messages (excluding the featured one)
  const otherMessages = messages.filter((m) => m._id !== featuredMessage?._id);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-(--color-primary) to-(--color-secondary)">
              Insights &amp; Messages
            </h2>
            <p className="text-(--text-secondary) mb-6 leading-relaxed">
              Explore our latest gatherings, seminars, and activities designed
              to strengthen our community and foster new connections.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {/* Loading skeleton */}
            <div className="card flex flex-col lg:flex-row overflow-hidden animate-pulse">
              <div className="w-full lg:w-2/5 h-64 lg:h-auto bg-base-300"></div>
              <div className="p-8 lg:p-12 flex-1 space-y-4">
                <div className="h-8 bg-base-300 rounded w-3/4"></div>
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (messages.length === 0) {
    return (
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-(--color-primary) to-(--color-secondary)">
              Insights &amp; Messages
            </h2>
            <p className="text-(--text-secondary) mb-6 leading-relaxed">
              No messages available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-(--color-primary) to-(--color-secondary)">
            Insights &amp; Messages
          </h2>
          <p className="text-(--text-secondary) mb-6 leading-relaxed">
            Explore our latest gatherings, seminars, and activities designed to
            strengthen our community and foster new connections.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Featured Message */}
          {featuredMessage && (
            <div className="card flex flex-col lg:flex-row overflow-hidden group">
              <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                {featuredMessage.image ? (
                  <Image
                    src={featuredMessage.image}
                    alt={featuredMessage.personName || featuredMessage.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                    <span className="text-xl opacity-50">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-(--color-secondary)">
                  {featuredMessage.title}
                </h3>
                <p className="text-(--text-secondary) mb-6 leading-relaxed">
                  &quot;{featuredMessage.message}&quot;
                </p>
                {featuredMessage.personName && (
                  <p className="text-sm font-semibold text-(--color-primary)">
                    — {featuredMessage.personName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Secondary Messages - Grid */}
          {otherMessages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="card flex flex-col overflow-hidden group h-full"
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    {msg.image ? (
                      <Image
                        src={msg.image}
                        alt={msg.personName || msg.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-base-300 flex items-center justify-center">
                        <span className="text-lg opacity-50">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col grow">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-(--text-primary)">
                      {msg.title}
                    </h3>
                    <p className="text-(--text-secondary) mb-6 grow line-clamp-4">
                      {msg.message}
                    </p>
                    {msg.personName && (
                      <p className="text-sm font-semibold text-(--color-primary)">
                        — {msg.personName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
