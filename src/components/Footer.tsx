"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Placeholders: replace with the real details
const CONTACT = {
  email: "hello@upto.com",
  phone: "+1 555 010 0199",
  address: "100 Harbour Road, Singapore",
};

const COLUMNS = [
  {
    title: "Services",
    links: [
      ["Air freight", "#services"],
      ["Sea freight", "#services"],
      ["Road freight", "#services"],
      ["Warehousing", "#services"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#about"],
      ["Our network", "#network"],
      ["Track a shipment", "#tracking"],
      ["Get a quote", "#quote"],
    ],
  },
  {
    title: "Follow",
    links: [
      ["LinkedIn", "#"],
      ["Instagram", "#"],
      ["X", "#"],
    ],
  },
];

const link =
  "relative inline-block after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16151A] motion-reduce:after:transition-none";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q(".f-in"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        // Wordmark letters rise from the bottom edge
        gsap.from(q(".f-char"), {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: mark.current, start: "top 95%" },
        });

      });
    },
    { scope: root }
  );

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer id="contact" ref={root} className="overflow-hidden bg-white px-[4vw] pt-20 text-[#16151A]">
      {/* Top: contact + links */}
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="f-in flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 bg-[#FF4D1F]" aria-hidden />
            Say hello
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="f-in group mt-5 flex items-center gap-5 focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-[#FF4D1F]"
          >
            <span className="break-all text-[clamp(2rem,5.2vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em]">{CONTACT.email}</span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#FF4D1F] transition-transform duration-500 group-hover:rotate-45 md:size-16 motion-reduce:transition-none">
              <svg viewBox="0 0 16 16" className="size-5 md:size-7" fill="none" stroke="#16151A" strokeWidth="2" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </a>
          <address className="f-in mt-6 text-[18px] font-medium not-italic leading-relaxed opacity-70">
            {CONTACT.phone}
            <br />
            {CONTACT.address}
          </address>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((c) => (
            <div key={c.title} className="f-in">
              <h3 className="border-t-2 border-[#16151A] pt-3 text-sm font-medium opacity-70">{c.title}</h3>
              <ul className="mt-4 space-y-3 text-lg font-medium">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className={link}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#16151A]/15 py-5 text-sm font-medium">
        <p>© {new Date().getFullYear()} Upto. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className={link}>
            Privacy
          </a>
          <a href="#" className={link}>
            Terms
          </a>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-2 rounded-full bg-[#16151A] py-2 pl-4 pr-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4D1F]"
          >
            Back to top
            <span className="grid size-7 place-items-center rounded-full bg-[#FF4D1F] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="#16151A" strokeWidth="2" aria-hidden>
                <path d="M8 13V3M4 7l4-4 4 4" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Giant wordmark: deliberately cropped by the bottom edge */}
      <div
        ref={mark}
        aria-hidden
        style={{ "--f": "min(38vw, 38rem)" } as CSSProperties}
        className="mt-4 flex h-[calc(var(--f)*0.8)] justify-between overflow-hidden text-[length:var(--f)] font-extrabold leading-[0.8] tracking-[-0.05em]"
      >
        {"upto".split("").map((c, i) => (
          <span key={i} className="inline-block">
            <span className="f-char inline-block will-change-transform">{c}</span>
          </span>
        ))}
      </div>
    </footer>
  );
}