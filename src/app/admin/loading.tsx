"use client";

import Logo from "@/components/Logo/Logo";

export default function Loading() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="space-y-8 text-center">
          {/* Logo with rotating animation */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-secondary border-r-accent"></div>
              <div className="absolute inset-2 flex items-center justify-center">
                <Logo size="md" />
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Loading
            </h2>
            <div className="flex justify-center gap-1">
              <span
                className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="inline-block w-2 h-2 bg-secondary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="inline-block w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary via-secondary to-accent rounded-full"
              style={{
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>

          {/* Status message */}
          <p className="text-sm sm:text-base text-secondary">
            Please wait while we prepare your content...
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            width: 10%;
            margin-left: 0%;
          }
          50% {
            width: 100%;
            margin-left: 0%;
          }
          100% {
            width: 10%;
            margin-left: 90%;
          }
        }
      `}</style>
    </div>
  );
}
