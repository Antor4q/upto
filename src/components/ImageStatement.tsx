"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IMG = "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80";

export default function ImageStatement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      // Text reveal: all screens
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          section.querySelectorAll(".statement-reveal"),
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // Parallax: md+ only (scrubbed parallax is janky on touch / mobile address-bar resize)
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          section.querySelector(".statement-image"),
          { yPercent: -4, scale: 1.08 },
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

      // Small screens: no parallax, just a static slight zoom
      mm.add("(max-width: 767px)", () => {
        gsap.set(section.querySelector(".statement-image"), { scale: 1.08 });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Our perspective on global logistics"
      className="relative isolate flex min-h-[460px] items-center overflow-hidden bg-[#16151A] px-5 py-16 text-white sm:min-h-[500px] sm:px-[4vw] sm:py-24 lg:min-h-[540px] lg:py-28"
    >
      {/* Parallax background image */}
      <div
        aria-hidden="true"
        className="statement-image pointer-events-none absolute inset-0 -z-20"
      >
        <img
          src={`${IMG}&w=1400`}
          srcSet={`${IMG}&w=800 800w, ${IMG}&w=1400 1400w, ${IMG}&w=2400 2400w`}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#080808]/60"
      />

      {/* Gradient for text contrast: top-to-bottom on mobile, left-to-right from sm */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#080808]/50 via-[#080808]/30 to-[#080808]/60 sm:bg-gradient-to-r sm:from-[#080808]/70 sm:via-[#080808]/35 sm:to-[#080808]/20"
      />

      {/* Content */}
      <div className="w-full min-w-0">
        <p className="statement-reveal mb-4 flex items-center gap-2 text-sm font-medium sm:mb-6">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 bg-[#FF4D1F]"
          />
          Our Perspective
        </p>

        <h2 className="statement-reveal text-[clamp(2.25rem,9vw,8rem)] font-bold leading-[1] tracking-[-0.04em] sm:max-w-[16ch]">
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

          <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-white/75 sm:text-xs">
            Upto — Built to Keep You Moving
          </span>
        </div>
      </div>
    </section>
  );
}