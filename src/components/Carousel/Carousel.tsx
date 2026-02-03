"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import Image from "next/image";
import { Metadata } from "next";

interface CarouselSlide {
  src: string;
  alt: string;
  legend: string;
}

interface CarouselProps {
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  transitionTime?: number;
  infiniteLoop?: boolean;
  showThumbs?: boolean;
  showStatus?: boolean;
}

const defaultSlides: CarouselSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=500&fit=crop",
    alt: "Slide 1 - GBA Event",
    legend: "GBA Events",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop",
    alt: "Slide 2 - Community",
    legend: "Community",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=500&fit=crop",
    alt: "Slide 3 - Activities",
    legend: "Activities",
  },
  {
    src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=500&fit=crop",
    alt: "Slide 4 - Networking",
    legend: "Networking",
  },
];

export const metadata: Metadata = {
  title: "GBA Carousel",
  description:
    "A dynamic carousel component showcasing images and legends for the Greater Bogura Association Khulna University website.",
};
export default function Carousel({
  slides = defaultSlides,
  autoPlay = true,
  interval = 3500,
  transitionTime = 800,
  infiniteLoop = true,
  showThumbs = false,
  showStatus = false,
}: CarouselProps) {
  return (
    <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2 overflow-hidden rounded-lg shadow-xl border border-t-0 border-[var(--border-color)]">
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
            key={index}
            className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 2xl:h-screen/2"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            {/* Legend */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <p className="text-gray-200 font-bold text-lg sm:text-xl md:text-2xl drop-shadow-lg">
                {slide.legend}
              </p>
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
