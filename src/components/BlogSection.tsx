
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ARTICLES = [
  {
    title: "The Future of Freight Is Already Moving.",
    description:
      "How smarter logistics, real-time visibility, and connected supply chains are reshaping global trade.",
    image:
      "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=85",
    alt: "Freight containers and global shipping operations",
  },
  {
    title: "A Better Supply Chain Starts With Better Decisions.",
    description:
      "Why operational visibility and smarter planning are becoming a competitive advantage for businesses moving goods worldwide.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    alt: "Goods organized inside a logistics warehouse",
  },
  {
    title: "Beyond Borders. Built Around Business.",
    description:
      "The infrastructure, partnerships, and planning that keep international freight moving across borders.",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=85",
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

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            section.querySelectorAll(".blog-reveal"),
            {
              y: 35,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="blog"
      className="bg-white px-[4vw] pt-28 text-[#16151A] "
    >
      {/* Section heading: Left / Right */}
      <div className="blog-reveal mb-14 grid grid-cols-1 gap-6 sm:mb-16 lg:mb-20 lg:grid-cols-[1.5fr_0.5fr] lg:items-end lg:gap-12">
        {/* Left: Heading */}
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm font-medium">
            <span
              aria-hidden="true"
              className="size-2.5 bg-[#FF4D1F]"
            />
            Insights & Perspectives
          </p>

          <h2 className="max-w-[16ch] text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[1] tracking-[-0.04em]">
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

      {/* Blog articles */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
        {ARTICLES.map((article) => (
          <article
            key={article.title}
            className="blog-reveal group min-w-0"
          >
            {/* Image */}
            <div className="aspect-[1.2/1] overflow-hidden bg-white">
              <img
                src={article.image}
                alt={article.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* Article title */}
            <h3 className="mt-6 max-w-[22ch] text-[clamp(1.65rem,2.5vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.04em] transition-colors duration-300 group-hover:text-[#FF4D1F]">
              {article.title}
            </h3>

            {/* Article description */}
            <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-[#16151A]/65 sm:text-[18px]">
              {article.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
