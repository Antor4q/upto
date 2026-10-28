"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`;

const ARTICLES = [
  {
    title: "The Future of Freight Is Already Moving.",
    description:
      "How smarter logistics, real-time visibility, and connected supply chains are reshaping global trade.",
    image: u("photo-1494412519320-aa613dfb7738"),
    alt: "Freight containers and global shipping operations",
  },
  {
    title: "A Better Supply Chain Starts With Better Decisions.",
    description:
      "Why operational visibility and smarter planning are becoming a competitive advantage for businesses moving goods worldwide.",
    image: u("photo-1586528116311-ad8dd3c8310d"),
    alt: "Goods organized inside a logistics warehouse",
  },
  {
    title: "Beyond Borders. Built Around Business.",
    description:
      "The infrastructure, partnerships, and planning that keep international freight moving across borders.",
    image: u("photo-1578575437130-527eed3abbec"),
    alt: "Shipping containers ready for international transport",
  },
];

export default function BlogSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          section.querySelectorAll(".blog-reveal"),
          { y: 35, autoAlpha: 0 },
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

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="blog"
      className="overflow-x-clip bg-white px-5 pt-16 text-[#16151A] sm:px-[4vw] sm:pt-20 lg:pt-28"
    >
      {/* Section heading: Left / Right */}
      <div className="blog-reveal mb-10 grid grid-cols-1 gap-5 sm:mb-14 sm:gap-6 lg:mb-20 lg:grid-cols-[1.5fr_0.5fr] lg:items-end lg:gap-12">
        {/* Left: Heading */}
        <div className="min-w-0">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium sm:mb-6">
            <span aria-hidden="true" className="size-2.5 shrink-0 bg-[#FF4D1F]" />
            Insights & Perspectives
          </p>

          <h2 className="text-[clamp(2.25rem,9vw,8rem)] font-bold leading-[1] tracking-[-0.04em] sm:max-w-[16ch]">
            Ideas that move{" "}
            <span className="text-[#FF4D1F]">business.</span>
          </h2>
        </div>

        {/* Right: Description */}
        <p className="max-w-xl text-base font-medium leading-relaxed text-[#16151A]/65 sm:text-[18px] lg:justify-self-end lg:pb-2">
          Perspectives on freight, global trade, and the ideas shaping how
          businesses move forward.
        </p>
      </div>

      {/* Blog articles: 1 col → 2 col (md) → 3 col (lg) */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:gap-y-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
        {ARTICLES.map((article, i) => {
          // On tablet (2 cols) the odd third card spans full width so the grid doesn't end with a hole
          const wide = i === ARTICLES.length - 1 && ARTICLES.length % 2 === 1;

          return (
            <article
              key={article.title}
              className={`blog-reveal group min-w-0 ${wide ? "md:max-lg:col-span-2" : ""}`}
            >
              {/* Image */}
              <div
                className={`aspect-[1.2/1] overflow-hidden bg-[#16151A]/5 ${
                  wide ? "md:max-lg:aspect-[2.2/1]" : ""
                }`}
              >
                <img
                  src={`${article.image}&w=900`}
                  srcSet={`${article.image}&w=600 600w, ${article.image}&w=900 900w, ${article.image}&w=1200 1200w`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt={article.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.04]"
                />
              </div>

              {/* Article title */}
              <h3 className="mt-5 max-w-[22ch] text-2xl font-bold leading-[1.05] tracking-[-0.04em] transition-colors duration-300 sm:mt-6 md:text-[1.75rem] lg:text-[clamp(1.65rem,2.5vw,2.5rem)] [@media(hover:hover)]:group-hover:text-[#FF4D1F]">
                {article.title}
              </h3>

              {/* Article description */}
              <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-[#16151A]/65 sm:mt-4 sm:text-[18px]">
                {article.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}