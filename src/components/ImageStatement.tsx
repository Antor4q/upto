
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ImageStatement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Text reveal animation
        gsap.fromTo(
          section.querySelectorAll(".statement-reveal"),
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          }
        );

        // Subtle background parallax
        gsap.fromTo(
          section.querySelector(".statement-image"),
          {
            yPercent: -4,
            scale: 1.08,
          },
          {
            yPercent: 4,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Our perspective on global logistics"
      className="relative isolate flex min-h-[460px] items-center overflow-hidden bg-[#16151A] px-[4vw] py-20 text-white sm:min-h-[500px] sm:py-24 lg:min-h-[540px] lg:py-28"
    >
      {/* Parallax background image */}
      <div
        aria-hidden="true"
        className="statement-image pointer-events-none absolute inset-0 -z-20"
      >
        <img
          src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2400&q=85"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#080808]/60"
      />

      {/* Additional gradient for text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#080808]/70 via-[#080808]/35 to-[#080808]/20"
      />

      {/* Content */}
      <div className="w-full">
        <p className="statement-reveal mb-6 flex items-center gap-2 text-sm font-medium">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 bg-[#FF4D1F]"
          />
          Our Perspective
        </p>

        <h2 className="statement-reveal max-w-[16ch] text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[1] tracking-[-0.04em]">
          Global logistics.
          <br />
          A different{" "}
          <span className="text-[#FF4D1F]">perspective.</span>
        </h2>

        <div className="statement-reveal mt-8 flex flex-col gap-5 border-t border-white/25 pt-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <p className="max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-[18px]">
            Every shipment connects a business to its next opportunity.
            We bring the planning and coordination to keep global freight
            moving.
          </p>

          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-white/75">
            Upto — Built to Keep You Moving
          </span>
        </div>
      </div>
    </section>
  );
}


