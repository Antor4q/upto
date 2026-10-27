"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 64 64" className="size-16 shrink-0 md:size-20" fill="none" stroke="#16151A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

const STEPS = [
  {
    n: "01",
    label: "Quote",
    title: "Request a quote",
    body: "Share your route, cargo and dates. We reply with one clear price and a delivery date, usually within 24 hours.",
    meta: "Within 24 hours",
    icon: (
      <Icon>
        <path d="M14 6h28l10 10v42H14z" />
        <path d="M42 6v10h10M22 28h22M22 38h22M22 48h14" />
      </Icon>
    ),
  },
  {
    n: "02",
    label: "Pickup",
    title: "Pickup and paperwork",
    body: "We collect from your door, check the cargo, and prepare the customs documents so nothing stalls at the port.",
    meta: "Day 1 to 2",
    icon: (
      <Icon>
        <path d="M4 18h34v28H4zM38 26h12l10 10v10H38z" />
        <circle cx="16" cy="50" r="5" />
        <circle cx="48" cy="50" r="5" />
      </Icon>
    ),
  },
  {
    n: "03",
    label: "Transit",
    title: "On the move",
    body: "Your container travels by air, sea or road. Follow every leg live and get an alert the moment anything changes.",
    meta: "Live tracking",
    icon: (
      <Icon>
        <path d="M6 38h52l-8 14H14z" />
        <path d="M18 38V26h22v12M22 26v-8h12v8" />
        <path d="M6 58q6-4 13 0t13 0 13 0 13 0" />
      </Icon>
    ),
  },
  {
    n: "04",
    label: "Delivered",
    title: "Delivered, signed off",
    body: "Cleared, handed over at the dock and confirmed. You get a delivery report for your records.",
    meta: "On the day we said",
    icon: (
      <Icon>
        <circle cx="32" cy="32" r="24" />
        <path d="m21 33 8 8 15-17" />
      </Icon>
    ),
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal scroll, the container travels along the rail
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const dist = () => Math.max(0, t.scrollWidth - (t.parentElement as HTMLElement).clientWidth);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: pin.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.to(t, { x: () => -dist(), duration: 1 })
          .to(q(".proc-fill"), { scaleX: 1, duration: 1 }, 0)
          .to(q(".proc-marker"), { left: "100%", duration: 1 }, 0);
        q(".proc-dot").forEach((d, i) => {
          tl.to(d, { backgroundColor: "#FF4D1F", borderColor: "#FF4D1F", scale: 1.3, duration: 0.001 }, (i / (STEPS.length - 1)) * 0.995);
        });
      });

      // Mobile: stacked steps that slide in
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        q<HTMLElement>(".proc-step").forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="process" ref={root} className="bg-white text-[#16151A]">
      <div
        ref={pin}
        className="px-[4vw] py-28 motion-safe:md:flex motion-safe:md:h-svh motion-safe:md:flex-col motion-safe:md:justify-between motion-safe:md:overflow-hidden motion-safe:md:py-[9svh]"
      >
        {/* Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            How it
            <br />
            works.
          </h2>
          <p className="max-w-sm text-[18px] font-medium leading-relaxed opacity-70">
            Four steps from your first message to the dock, with one team looking after every one of them.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 motion-safe:md:mt-0">
          <ol ref={track} className="flex flex-col gap-12 motion-safe:md:w-max motion-safe:md:flex-row motion-safe:md:gap-[4vw]">
            {STEPS.map((s) => (
              <li key={s.n} className="proc-step border-t-2 border-[#16151A] pt-6 motion-safe:md:w-[min(52vw,620px)] motion-safe:md:shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <span
                    aria-hidden
                    className="text-[clamp(5rem,11vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_#16151A]"
                  >
                    {s.n}
                  </span>
                  {s.icon}
                </div>
                <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-md text-[18px] font-medium leading-relaxed opacity-70">{s.body}</p>
                <p className="mt-5 inline-flex items-center gap-2 bg-[#16151A] px-3 py-1.5 text-sm font-semibold text-white">
                  <span className="size-2 bg-[#FF4D1F]" aria-hidden />
                  {s.meta}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Progress rail (desktop only) */}
        <div aria-hidden className="relative hidden h-4 motion-safe:md:mb-10 motion-safe:md:block">
          <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#16151A]/15" />
          <span className="proc-fill absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 scale-x-0 bg-[#FF4D1F]" />
          {STEPS.map((s, i) => (
            <span key={s.n} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(i * 100) / (STEPS.length - 1)}%` }}>
              <span className="proc-dot block size-4 rounded-full border-2 border-[#16151A]/30 bg-white" />
              <span className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-sm font-medium">{s.label}</span>
            </span>
          ))}
          <svg viewBox="0 0 32 20" className="proc-marker absolute left-0 top-1/2 z-10 h-5 w-8 -translate-x-1/2 -translate-y-1/2">
            <rect width="32" height="20" rx="2" fill="#FF4D1F" stroke="#16151A" strokeWidth="1.5" />
            {[6, 11, 16, 21, 26].map((x) => (
              <line key={x} x1={x} y1="3" x2={x} y2="17" stroke="#16151A" strokeOpacity=".35" strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}