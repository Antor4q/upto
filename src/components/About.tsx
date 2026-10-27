"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const STATEMENT = "We move freight for businesses that can’t afford to wait.";
const HIGHLIGHT = new Set(["freight", "wait"]);

const TIMELINE = [
  {
    year: "2020",
    title: "Founded",
    body: "Two trucks, one rented dock, and a simple promise: every shipment stays visible from the moment it leaves the warehouse. We answered our own phones, knew every driver by name, and told customers the truth early, even when the news wasn’t good.",
  },
  {
    year: "2022",
    title: "40 countries",
    body: "Demand pulled us across borders faster than we planned. We opened routes through ports on four continents, signed local partners we trust, and built one team that handles customs, paperwork and last-mile delivery, so customers only deal with Upto.",
  },
  {
    year: "2024",
    title: "Live tracking",
    body: "We launched live tracking so nobody has to chase an update. Every container is followed from booking to delivery, with clear status changes, estimated arrival times and alerts the moment something shifts, all in one place.",
  },
  {
    year: "Today",
    title: "12,000+ shipments",
    body: "More than 12,000 shipments moved, and the rule hasn’t changed. We plan around dates, not excuses, and keep improving routing, clearance and support so the next shipment goes smoother than the last.",
  },
];

// Vertical ribs like container doors
const ribs = {
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 3px, transparent 3px 28px)",
};

// Horizontal padding that also respects notches in landscape
const padX =
  "pl-[max(4vw,env(safe-area-inset-left))] pr-[max(4vw,env(safe-area-inset-right))]";

export default function About() {
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLDivElement>(null);
  const doors = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Statement: words go from faint to solid as you scroll
        gsap.fromTo(
          q(".word"),
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: statement.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: true,
            },
          }
        );

        // 2. Container doors: smooth pin and reveal
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: doors.current,
              start: "top top",
              end: "+=180%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(
            q(".door-l"),
            {
              xPercent: -100,
              duration: 1,
            },
            0
          )
          .to(
            q(".door-r"),
            {
              xPercent: 100,
              duration: 1,
            },
            0
          )
          .fromTo(
            q(".inside"),
            {
              scale: 0.96,
              opacity: 0.3,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
            },
            0
          );

        // 3. Timeline rows: orange line draws in, content rises
        q<HTMLElement>(".tl-item").forEach((item) => {
          gsap.fromTo(
            item.querySelector(".tl-line"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 45%",
                scrub: true,
              },
            }
          );

          gsap.from(item.querySelectorAll(".tl-in"), {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
          });
        });
      });

      // Reduced motion: doors already open, text solid, nothing pinned
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".door-l"), { xPercent: -100 });
        gsap.set(q(".door-r"), { xPercent: 100 });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="about"
      ref={root}
      className="bg-white text-[#16151A]"
    >
      {/* 1. Statement */}
      <div ref={statement} className={`${padX} py-16 sm:py-24 lg:py-28`}>
        <p className="mb-6 flex items-center gap-2 text-sm font-medium">
          <span
            className="size-2.5 bg-[#FF4D1F]"
            aria-hidden
          />
          About Upto
        </p>

        <p className="max-w-[16ch] text-[clamp(2.25rem,8vw,8rem)] font-bold leading-[1] tracking-[-0.04em] sm:max-w-[18ch]">
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i}>
              <span
                className={`word inline-block ${
                  HIGHLIGHT.has(w.replace(/[.,]/g, ""))
                    ? "text-[#FF4D1F]"
                    : ""
                }`}
              >
                {w}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>

      {/* 2. Container doors */}
      <div
        ref={doors}
        className="relative h-svh overflow-hidden bg-[#16151A] text-white"
      >
        <div className={`inside absolute inset-0 grid place-items-center ${padX} text-center`}>
          <div>
            <p className="text-base font-medium text-[#FF4D1F]">
              Since 2020
            </p>

            <h2 className="mt-3 text-[clamp(2rem,min(8vw,12svh),7rem)] font-bold leading-[0.95] tracking-[-0.04em]">
              From one truck to 40+<br/> countries.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed opacity-70 sm:text-[18px]">
              We started with a simple rule: tell people where their cargo
              is, and get it there when we said we would.
            </p>
          </div>
        </div>

        <div
          aria-hidden
          className="door door-l absolute inset-y-0 left-0 flex w-1/2 items-center justify-end border-r-4 border-[#16151A] bg-[#FF4D1F] pr-[1.5vw]"
          style={ribs}
        >
          <span className="text-[length:min(24vw,70svh)] font-bold leading-none tracking-[-0.06em] text-[#16151A]">
            UP
          </span>
        </div>

        <div
          aria-hidden
          className="door door-r absolute inset-y-0 right-0 flex w-1/2 items-center justify-start border-l-4 border-[#16151A] bg-[#FF4D1F] pl-[1.5vw]"
          style={ribs}
        >
          <span className="text-[length:min(24vw,70svh)] font-bold leading-none tracking-[-0.06em] text-[#16151A]">
            TO
          </span>
        </div>
      </div>

      {/* 3. Timeline */}
      <div className={`grid gap-6 ${padX} py-16 sm:py-20 md:grid-cols-[1fr_1.5fr] md:gap-8 lg:py-28`}>
        <h2 className="self-start text-[clamp(2.75rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em] md:sticky md:top-[20svh]">
          Built
          <br />
          to move.
        </h2>

        <ul>
          {TIMELINE.map((t) => (
            <li
              key={t.year}
              className="tl-item relative grid gap-3 border-t border-[#16151A]/15 py-8 sm:py-10 lg:grid-cols-[9.5rem_1fr] lg:gap-8 lg:py-12 xl:grid-cols-[11rem_1fr]"
            >
              <span
                aria-hidden
                className="tl-line absolute -top-px left-0 h-0.5 w-full origin-left bg-[#FF4D1F]"
              />

              <p className="tl-in text-5xl font-bold leading-none tracking-[-0.04em] xl:text-6xl">
                {t.year}
              </p>

              <div>
                <h3 className="tl-in text-xl font-semibold">
                  {t.title}
                </h3>

                <p className="tl-in mt-2 max-w-xl text-base font-medium leading-relaxed opacity-70 sm:text-[18px]">
                  {t.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}