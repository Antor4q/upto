"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Simple line-art icons (64x64, inherit currentColor)
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 64 64"
    className="size-16 transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transition-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const SERVICES = [
  {
    title: "Air freight",
    body: "Time-critical cargo, delivered in days. Priority handling, direct routes and customs cleared before you land.",
    icon: (
      <Icon>
        <path d="M32 6c2 0 3 2 3 5v14l22 12v5l-22-6v12l6 5v4l-9-3-9 3v-4l6-5V36l-22 6v-5l22-12V11c0-3 1-5 3-5z" />
      </Icon>
    ),
  },
  {
    title: "Sea freight",
    body: "Full and part containers across 40+ countries, with fixed schedules and clear costs from port to port.",
    icon: (
      <Icon>
        <path d="M6 38h52l-8 14H14z" />
        <path d="M18 38V26h22v12M22 26v-8h12v8" />
        <path d="M6 58q6-4 13 0t13 0 13 0 13 0" />
      </Icon>
    ),
  },
  {
    title: "Road freight",
    body: "Door-to-door trucking with live tracking. Reliable pickups, last-mile drops and cross-border runs.",
    icon: (
      <Icon>
        <path d="M4 18h34v28H4zM38 26h12l10 10v10H38z" />
        <circle cx="16" cy="50" r="5" />
        <circle cx="48" cy="50" r="5" />
      </Icon>
    ),
  },
  {
    title: "Warehousing",
    body: "Secure storage near the major ports, with inventory visibility and fast dispatch when you’re ready.",
    icon: (
      <Icon>
        <path d="M6 28 32 10l26 18v26H6z" />
        <path d="M22 54V36h20v18M22 45h20" />
      </Icon>
    ),
  },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q(".svc-head"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from(q(".svc-card"), {
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: grid.current, start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="bg-white px-[4vw] py-28 text-[#16151A]">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="svc-head text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em]">
          What we
          <br />
          move.
        </h2>
        <p className="svc-head max-w-sm text-[18px] font-medium leading-relaxed opacity-70">
          Four ways to get cargo where it needs to be, all tracked and all handled by one team.
        </p>
      </div>

      <ul ref={grid} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="svc-card">
            {/* hover lift lives on the anchor so it never fights the GSAP reveal on the li */}
            <a
              href="#"
              className="group relative flex min-h-[26rem] flex-col justify-between overflow-hidden bg-[#16151A] p-6 text-white transition-transform duration-500 hover:-translate-y-6 focus-visible:-translate-y-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4D1F] motion-reduce:transition-none lg:min-h-[30rem]"
            >
              <span
                aria-hidden
                className="absolute inset-0 translate-y-full bg-[#FF4D1F] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
              />
              <div className="relative flex items-start justify-between transition-colors duration-500 group-hover:text-[#16151A] group-focus-visible:text-[#16151A]">
                <span className="text-sm font-medium">{String(i + 1).padStart(2, "0")}</span>
                {s.icon}
              </div>
              <div className="relative transition-colors duration-500 group-hover:text-[#16151A] group-focus-visible:text-[#16151A]">
                <h3 className="text-3xl font-bold tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-3 text-[18px] font-medium leading-relaxed opacity-70">{s.body}</p>
                <span className="mt-6 flex items-center gap-2 text-sm font-semibold">
                  Learn more
                  <svg viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M2 8h11M9 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}