"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MARQUEE = ["Get a quote", "Track a shipment", "Ship with Upto", "Freight, lifted"];

const POINTS = [
  { n: "01", title: "Reply in 24 hours", body: "Send us your route and cargo. A real person comes back with a price and a delivery date." },
  { n: "02", title: "One clear price", body: "No surprise fees at the dock. What we quote is what you pay." },
  { n: "03", title: "Tracked from day one", body: "Follow your container from booking to delivery, live, from any screen." },
];

// Same mask-reveal letters as the hero; padding keeps descenders and tight glyph edges unclipped.
function Word({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`flex ${className}`} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="-mx-[0.06em] -mb-[0.24em] inline-block overflow-hidden px-[0.06em] pb-[0.24em] pt-[0.06em]">
          <span className="cta-char inline-block will-change-transform">{c}</span>
        </span>
      ))}
    </span>
  );
}

const Diamond = () => (
  <svg viewBox="0 0 16 16" className="size-5 shrink-0" fill="currentColor" aria-hidden>
    <path d="M8 0l8 8-8 8-8-8z" />
  </svg>
);

const ribs = {
  backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 3px, transparent 3px 28px)",
  maskImage: "linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent)",
};

export default function Cta() {
  const root = useRef<HTMLElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Marquee that speeds up with scroll velocity (only if a .marquee exists)
        const marquee = q(".marquee");
        if (marquee.length) {
          const tw = gsap.to(marquee, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
          ScrollTrigger.create({
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              tw.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 200, 6));
              gsap.to(tw, { timeScale: 1, duration: 1, overwrite: true });
            },
          });
        }

        // 2. Reveal: letters rise, button pops in, points slide up
        const tl = gsap.timeline({ scrollTrigger: { trigger: zone.current, start: "top 85%" } });
        const chars = q(".cta-char");
        if (chars.length) {
          tl.from(chars, { yPercent: 110, duration: 1.1, stagger: 0.05, ease: "power4.out" }, 0);
        }
        if (btn.current) {
          tl.from(btn.current, { scale: 0, rotation: -30, duration: 1, ease: "back.out(1.6)" }, 0.3);
        }
        tl.from(q(".cta-point"), { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 0.6);

        // 3. Magnetic button (mouse devices only)
        if (window.matchMedia("(hover: hover)").matches && btn.current) {
          const el = btn.current;
          const bx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
          const by = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2 - (gsap.getProperty(el, "x") as number);
            const cy = r.top + r.height / 2 - (gsap.getProperty(el, "y") as number);
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const near = Math.hypot(dx, dy) < r.width * 0.9;
            bx(near ? dx * 0.3 : 0);
            by(near ? dy * 0.3 : 0);
          };
          window.addEventListener("pointermove", onMove);
          return () => window.removeEventListener("pointermove", onMove);
        }
      });
    },
    { scope: root }
  );

  return (
    // id="quote" so the hero and menu "Get a quote" buttons scroll here
    <section id="quote" ref={root} className="relative overflow-hidden bg-[#16151A] text-white">
      {/* Main */}
      <div className="relative px-5 py-16 sm:px-[4vw] sm:py-20 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={ribs} />

        <div ref={zone} className="relative min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 shrink-0 bg-[#FF4D1F]" aria-hidden />
            Let’s get moving
          </p>

          <h2 className="mt-4 text-[clamp(2.75rem,9vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em] sm:mt-6">
            Ready To
            <br />
            Move
          </h2>

          <ul className="mt-14 grid grid-cols-1 gap-8 sm:mt-20 lg:mt-24 lg:grid-cols-3 lg:gap-10">
            {POINTS.map((p) => (
              <li key={p.n} className="cta-point min-w-0 border-t-2 border-white pt-4">
                <p className="text-sm font-medium opacity-70">{p.n}</p>
                <h3 className="mt-3 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">{p.title}</h3>
                <p className="mt-2 max-w-sm text-base font-medium leading-relaxed opacity-70 sm:text-[18px]">{p.body}</p>
              </li>
            ))}
          </ul>

          <a
            href="#tracking"
            className="cta-point mt-10 inline-block py-2 text-base font-semibold underline decoration-[#FF4D1F] decoration-2 underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white sm:mt-12 sm:text-lg [@media(hover:hover)]:hover:decoration-white"
          >
            Or track a shipment now
          </a>
        </div>
      </div>
    </section>
  );
}