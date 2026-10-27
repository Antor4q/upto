"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContainerRig from "./Containerrig";

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const STATS = [
  { value: 12000, suffix: "+", label: "shipments moved" },
  { value: 40, suffix: "+", label: "countries served" },
  { value: 99, suffix: "%", label: "on-time delivery" },
];

// Mask-reveal letters. Extra padding inside the mask so descenders (p) and
// tight-tracked glyph edges are never clipped.
function Word({ text }: { text: string }) {
  return (
    <span className="flex" aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="-mx-[0.06em] -mb-[0.24em] inline-block overflow-hidden px-[0.06em] pb-[0.24em] pt-[0.06em]">
          <span className="char inline-block will-change-transform">{c}</span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Load sequence: letters rise, crane drops the container, container settles
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".char", { yPercent: 110, duration: 1.1, stagger: 0.05 })
          .from(".rig", { yPercent: -110, duration: 1.5, ease: "power3.out" }, 0.3)
          .fromTo(".sway", { rotation: 7 }, { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.25)" }, ">-0.4")
          .from(".fade", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=1.8")
          .add(() => {
            // 2. Idle sway
            gsap.to(".sway", { rotation: 1.2, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
          });

        // 3. Stats count up
        q<HTMLElement>(".stat").forEach((el) => {
          const end = Number(el.dataset.value);
          const suffix = el.dataset.suffix ?? "";
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 2,
            delay: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(o.v).toLocaleString("en-US") + suffix;
            },
          });
        });

        // 4. Scroll: container is hoisted up, headline scales up
        gsap.to(".lift", {
          yPercent: -70,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".headline", {
          scale: 1.2,
          transformOrigin: "50% 100%",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        // 5. Mouse parallax: container and text move in opposite directions
        if (window.matchMedia("(hover: hover)").matches) {
          const objX = gsap.quickTo(q(".par-obj")[0], "x", { duration: 1, ease: "power3" });
          const textX = gsap.quickTo(q(".headline")[0], "x", { duration: 1, ease: "power3" });
          const onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            objX(nx * 40);
            textX(-nx * 16);
          };
          window.addEventListener("mousemove", onMove);
          return () => window.removeEventListener("mousemove", onMove);
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-white text-[#16151A] md:min-h-[680px]"
    >
      {/* Headline (behind the container). "Upto" sits lower and to the right. */}
      <h1 className="headline absolute inset-x-0 top-[14svh] z-0 pl-[max(4vw,env(safe-area-inset-left))] pr-[max(4vw,env(safe-area-inset-right))] text-[clamp(3.5rem,min(19vw,26svh),21rem)] font-bold leading-[0.82] tracking-[-0.05em]">
        <div>
          <Word text="Deliver" />
        </div>
        <div className="mt-[4svh] flex justify-end">
          <Word text="Upto" />
        </div>
      </h1>

      {/* Crane + container (larger, capped by viewport height on short screens) */}
      <div className="lift pointer-events-none absolute inset-x-0 -top-[10svh] z-10 mx-auto w-[min(94vw,880px,120svh)]">
        <div className="rig">
          <div className="sway origin-top">
            <div className="par-obj">
              <ContainerRig />
            </div>
          </div>
        </div>
      </div>

      {/* Live tracking card, lower on the right */}
      <div className="fade absolute right-[max(4vw,env(safe-area-inset-right))] top-[24svh] z-20 hidden w-56 bg-[#FF4D1F] p-4 text-[#16151A] lg:block">
        <div className="flex items-center gap-2 text-[18px] font-semibold">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16151A] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#16151A]" />
          </span>
          Live tracking
        </div>
        <p className="mt-3 text-base font-medium leading-snug">Singapore to Rotterdam. Arrives in 6 days.</p>
      </div>

      {/* Video card (tablet and up) */}
      <div className="fade absolute bottom-[max(5svh,env(safe-area-inset-bottom))] left-[max(4vw,env(safe-area-inset-left))] z-20 hidden w-64 bg-[#16151A] p-3 text-[#F4F2EE] md:block lg:w-72">
        <button
          type="button"
          aria-label="Play video: how Upto moves your cargo"
          // Swap this for a modal / <video> when you have the real footage
          className="group relative block aspect-video w-full overflow-hidden bg-[#2a2930] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4D1F]"
        >
          <span aria-hidden className="absolute -right-2 top-0 h-full w-12 -skew-x-[14deg] bg-[#FF4D1F]" />
          <span aria-hidden className="absolute right-14 top-0 h-full w-12 -skew-x-[14deg] bg-[#FF4D1F]" />
          <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-[#F4F2EE] transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 10 10" className="ml-0.5 size-4" fill="#16151A" aria-hidden>
              <path d="M2 1v8l7-4z" />
            </svg>
          </span>
          <span className="absolute bottom-2 left-2 bg-[#16151A] px-2 py-0.5 text-xs font-medium">1:24</span>
        </button>
        <p className="mt-3 text-[18px] font-semibold leading-tight">See how we move your cargo</p>
        <p className="mt-1 text-base leading-snug opacity-70">
          From booking to the dock, a short look at how a shipment travels with Upto.
        </p>
        <a
          href="#quote"
          className="mt-4 block rounded-sm bg-[#FF4D1F] px-5 py-3 text-center text-[18px] font-medium text-[#16151A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4F2EE]"
        >
          Get a quote
        </a>
      </div>

      {/* Mobile: copy + quote */}
      <div className="fade absolute inset-x-0 bottom-[max(4svh,env(safe-area-inset-bottom))] z-20 pl-[max(4vw,env(safe-area-inset-left))] pr-[max(4vw,env(safe-area-inset-right))] md:hidden">
        <p className="max-w-xs text-base font-medium leading-snug sm:text-lg">Freight that moves at the speed of your business.</p>
        <a href="#quote" className="mt-4 inline-block rounded-sm bg-[#FF4D1F] px-6 py-4 text-sm font-semibold text-[#16151A]">
          Get a quote
        </a>
      </div>

      {/* Stats: three ruled columns, bottom right (lg and up) */}
      <ul className="fade absolute bottom-[max(5svh,env(safe-area-inset-bottom))] right-[max(4vw,env(safe-area-inset-right))] z-20 hidden gap-10 text-4xl tabular-nums xl:text-5xl lg:flex">
        {STATS.map((s, i) => (
          <li key={s.label} className={`shrink-0 border-t-2 border-[#16151A] pt-3 ${i === 0 ? "min-w-[7ch]" : "min-w-[5ch]"}`}>
            <p
              className="stat whitespace-nowrap font-semibold leading-none tracking-tight"
              data-value={s.value}
              data-suffix={s.suffix}
            >
              {s.value.toLocaleString("en-US") + s.suffix}
            </p>
            <p className="mt-2 whitespace-nowrap text-base opacity-70">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}