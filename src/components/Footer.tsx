"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Every footer link goes to the home page for now. Change this (or per-link hrefs) later.
const HOME = "/";

// Placeholders: replace with the real details
const CONTACT = {
  email: "hello@upto.com",
  phone: "+1 555 010 0199",
  address: "100 Harbour Road, Singapore",
};

const COLUMNS = [
  {
    title: "Services",
    links: ["Air freight", "Sea freight", "Road freight", "Warehousing"],
  },
  {
    title: "Company",
    links: ["About", "Our network", "Track a shipment", "Get a quote"],
  },
  {
    title: "Follow",
    links: ["LinkedIn", "Instagram", "X"],
  },
];

const link =
  "relative inline-block py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 focus-visible:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16151A] motion-reduce:after:transition-none [@media(hover:hover)]:hover:after:scale-x-100";

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
          scrollTrigger: { trigger: root.current, start: "top 85%" },
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
    <footer
      id="contact"
      ref={root}
      className="overflow-hidden bg-white px-5 pt-14 text-[#16151A] sm:px-[4vw] sm:pt-20"
    >
      {/* Top: contact + links */}
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0">
          <p className="f-in flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 shrink-0 bg-[#FF4D1F]" aria-hidden />
            Say hello
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="f-in group mt-4 flex items-center gap-3 focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-[#FF4D1F] sm:mt-5 sm:gap-5"
          >
            <span className="min-w-0 break-all text-[clamp(1.5rem,6.5vw,2.75rem)] font-extrabold leading-none tracking-[-0.04em] lg:text-[clamp(2rem,5.2vw,5.5rem)]">
              {CONTACT.email}
            </span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#FF4D1F] transition-transform duration-500 motion-reduce:transition-none md:size-16 [@media(hover:hover)]:group-hover:rotate-45">
              <svg viewBox="0 0 16 16" className="size-5 md:size-7" fill="none" stroke="#16151A" strokeWidth="2" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </a>
          <address className="f-in mt-5 text-base font-medium not-italic leading-relaxed opacity-70 sm:mt-6 sm:text-[18px]">
            {CONTACT.phone}
            <br />
            {CONTACT.address}
          </address>
        </div>

        <nav aria-label="Footer" className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10">
          {COLUMNS.map((c) => (
            <div key={c.title} className="f-in min-w-0">
              <h3 className="border-t-2 border-[#16151A] pt-3 text-sm font-medium opacity-70">{c.title}</h3>
              <ul className="mt-3 space-y-1 text-base font-medium sm:mt-4 sm:space-y-2 sm:text-lg">
                {c.links.map((label) => (
                  <li key={label}>
                    <Link href={HOME} className={link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-start gap-4 border-t border-[#16151A]/15 py-5 text-sm font-medium sm:mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Upto. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={HOME} className={link}>
            Privacy
          </Link>
          <Link href={HOME} className={link}>
            Terms
          </Link>
        
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