"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LINKS = ["Services", "Tracking", "FAQ", "About"];
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16151A]";

export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Intro + mobile menu timeline
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(bar.current, { yPercent: -100, opacity: 0, duration: 1, delay: 0.3, ease: "power4.out" });
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.inOut" } })
        .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8 })
        .from(".m-link", { yPercent: 110, duration: 0.7, stagger: 0.07, ease: "power4.out" }, "-=0.35")
        .from(".m-meta", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, "-=0.4");
      return () => tl.current?.kill();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(menu.current, { clipPath: "inset(0 0 100% 0)" });
    });
  });

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (!openRef.current && Math.abs(y - last) > 6) {
        gsap.to(bar.current, {
          yPercent: y > last && y > 120 ? -100 : 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu open/close: animation, scroll lock, inert, Escape, auto-close on desktop
  useEffect(() => {
    openRef.current = open;
    const el = menu.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");

    if (tl.current) {
      if (open) tl.current.play();
      else tl.current.reverse();
    } else {
      // reduced motion: swap instantly
      gsap.set(el, { clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" });
    }

    document.body.style.overflow = open ? "hidden" : "";
    if (open) gsap.to(bar.current, { yPercent: 0, duration: 0.2, overwrite: "auto" });

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);

    // Close menu if viewport grows to desktop (md breakpoint)
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 pl-[max(4vw,env(safe-area-inset-left))] pr-[max(4vw,env(safe-area-inset-right))] py-3 text-[#16151A] transition-colors duration-300 sm:py-4 ${
          scrolled && !open ? "border-b border-[#16151A]/10 bg-[#F4F2EE]/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <a href="#" onClick={() => setOpen(false)} className={`flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl ${focus}`}>
          <span className="grid size-6 place-items-center bg-[#FF4D1F] sm:size-7">
            <svg viewBox="0 0 16 16" className="size-3.5 sm:size-4" fill="none" stroke="#16151A" strokeWidth="2.2" aria-hidden>
              <path d="M3 11 8 4l5 7" />
            </svg>
          </span>
          upto
        </a>

        <nav aria-label="Primary" className="hidden gap-6 font-medium md:flex lg:gap-10">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={`relative text-base font-medium after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 lg:text-[18px] ${focus}`}
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-sm bg-[#16151A] px-4 py-2.5 text-base font-medium text-[#F4F2EE] transition-colors duration-300 hover:bg-[#FF4D1F] hover:text-[#16151A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4D1F] sm:inline-block lg:px-5 lg:py-3 lg:text-[18px]"
          >
            Contact us
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className={`min-h-11 w-20 rounded-sm border border-[#16151A] px-4 text-sm font-medium md:hidden ${focus}`}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Fullscreen menu (below md) */}
      <div
        id="mobile-menu"
        ref={menu}
        inert
        style={{ clipPath: "inset(0 0 100% 0)" }}
        className="fixed inset-0 z-40 flex flex-col justify-between gap-10 overflow-y-auto bg-[#FF4D1F] pb-[max(5svh,env(safe-area-inset-bottom))] pl-[max(4vw,env(safe-area-inset-left))] pr-[max(4vw,env(safe-area-inset-right))] pt-24 text-[#16151A] sm:pt-28 md:hidden"
      >
        <nav aria-label="Mobile">
          <ul>
            {LINKS.map((l) => (
              <li key={l} className="overflow-hidden">
                <a
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="m-link block text-[length:min(17vw,14svh)] font-extrabold leading-[0.95] tracking-[-0.05em] focus-visible:underline"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="m-meta max-w-xs text-base font-medium leading-snug sm:text-lg">Freight that moves at the speed of your business.</p>
          <a
            href="#quote"
            onClick={() => setOpen(false)}
            className="m-meta mt-6 inline-block rounded-sm bg-[#16151A] px-6 py-4 text-sm font-semibold text-[#F4F2EE]"
          >
            Get a quote
          </a>
        </div>
      </div>
    </>
  );
}