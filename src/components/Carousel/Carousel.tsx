"use client";

import { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import Image from "next/image";
import { Metadata } from "next";

interface CarouselSlide {
  _id: string;
  image: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
  transitionTime?: number;
  infiniteLoop?: boolean;
  showThumbs?: boolean;
  showStatus?: boolean;
}

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch("/api/carousel");
  const data = await res.json();
  const keywords: string[] = [];
  await data.data.forEach((slide: CarouselSlide) => {
    keywords.push(slide.title);
    keywords.push(slide.description || "");
  });
  return {
    keywords: keywords,
  };
}

export default function Carousel({
  autoPlay = true,
  interval = 3500,
  transitionTime = 800,
  infiniteLoop = true,
  showThumbs = false,
  showStatus = false,
}: CarouselProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/carousel");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error("Error fetching carousel data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2 overflow-hidden rounded-lg shadow-xl border border-t-0 border-[(--border-color)] bg-base-300 animate-pulse flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2 overflow-hidden rounded-lg shadow-xl border border-t-0 border-[(--border-color)] bg-base-200 flex items-center justify-center">
        <p className="text-lg text-base-content/50">No slides available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2 overflow-hidden rounded-lg shadow-xl border border-t-0 border-[--border-color]">
      <ReactCarousel
        autoPlay={autoPlay}
        interval={interval}
        transitionTime={transitionTime}
        infiniteLoop={infiniteLoop}
        showThumbs={showThumbs}
        showStatus={showStatus}
        stopOnHover
        swipeable
        dynamicHeight={false}
        className="carousel-container"
      >
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width={100}
              height={100}
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
            {/* Legend */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-left">
              {slide.title && (
                <p className="text-gray-200 font-bold text-lg sm:text-xl md:text-2xl drop-shadow-lg">
                  {slide.title}
                </p>
              )}
              {slide.description && (
                <p className="text-gray-300 text-sm sm:text-base mt-1 drop-shadow-md max-w-md">
                  {slide.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </ReactCarousel>

      {/* Custom styles for carousel */}
      <style jsx global>{`
        .carousel-container {
          width: 100%;
          height: 100%;
        }

        .carousel-container .carousel {
          height: 100%;
        }

        .carousel-container .slide {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: var(--bg-secondary);
        }

        .carousel-container button {
          z-index: 10;
          background-color: rgba(6, 182, 212, 0.5) !important;
          border: none;
          transition: background-color 0.3s ease;
        }

        .carousel-container button:hover {
          background-color: rgba(6, 182, 212, 0.8) !important;
        }

        .carousel-container .control-dots {
          padding-bottom: 20px;
        }

        .carousel-container .dot {
          background-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: none;
          border: none;
          transition: all 0.3s ease;
        }

        .carousel-container .dot.selected {
          background-color: var(--color-accent) !important;
        }

        .carousel-container .dot:hover {
          background-color: var(--color-primary) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .carousel-container .control-dots {
            padding-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}
