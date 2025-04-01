"use client";
import useMouseMove from "~/hooks/useMouseMove";
import type { ReactNode } from "react";
import "./background.css";

interface BackgroundProps {
  children: ReactNode;
  animateDots?: boolean;
}

export default function Background({ children, animateDots = true }: BackgroundProps) {
  // --x and --y will be updated based on mouse position
  useMouseMove();

  return (
    <>
      <div className="-z-50 fixed top-0 left-0">
        <div className="sticky top-0 left-0 h-screen w-screen overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
          
          {/* Animated glow effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-gradient-x" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20 animate-gradient-y" />
          </div>

          {/* Mouse follow effect */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-[--y] left-[--x] z-[-1] h-56 w-56 rounded-full bg-gradient-radial from-primary/20 via-primary/10 to-transparent blur-2xl transition-all duration-300" />

          {/* Animated dots pattern */}
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={animateDots ? "animate-dots opacity-10" : ""}>
            <defs>
              <pattern
                id="dotted-pattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
              <mask id="dots-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="currentColor"
              mask="url(#dots-mask)"
            />
          </svg>
        </div>
      </div>

      {children}
    </>
  );
}
