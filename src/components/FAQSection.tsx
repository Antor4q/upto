
"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FAQS = [
  {
    question: "What logistics services does Upto provide?",
    answer:
      "Upto helps businesses manage freight movement through coordinated logistics planning, shipment handling, and supply chain support. Contact our team to discuss your specific shipping requirements.",
  },
  {
    question: "Which countries and destinations do you cover?",
    answer:
      "Coverage depends on the shipment type, origin, destination, and service requirements. Share your route with our team so we can discuss the available options for your business.",
  },
  {
    question: "How can I get a shipping quote?",
    answer:
      "Get in touch with our team and share your shipment details, including origin, destination, cargo type, dimensions, and expected shipping date. We'll help you understand the next steps.",
  },
  {
    question: "How long does freight shipping take?",
    answer:
      "Transit times vary depending on the route, transportation method, customs clearance, and other operational factors. We'll help you understand the expected timeline for your shipment.",
  },
  {
    question: "Can Upto support ongoing business shipments?",
    answer:
      "Yes, we can discuss recurring shipping needs and logistics requirements for your business. Our approach starts with understanding your shipment volume, routes, and operational priorities.",
  },
  {
    question: "How do I get started with Upto?",
    answer:
      "Tell us about your business, what you're shipping, and where it needs to go. Our team can review your requirements and guide you through the next steps.",
  },
];

export default function FAQSection() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          section.querySelectorAll(".faq-reveal"),
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
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
      id="faq"
      className="bg-white px-[4vw] py-28 text-[#16151A] sm:py-32 lg:py-36"
    >
      {/* Header */}
      <div className="faq-reveal mb-14 grid grid-cols-1 gap-6 sm:mb-16 lg:mb-20 lg:grid-cols-[1.5fr_0.5fr] lg:items-end lg:gap-12">
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm font-medium">
            <span
              aria-hidden="true"
              className="size-2.5 bg-[#FF4D1F]"
            />
            Frequently Asked Questions
          </p>

          <h2 className="max-w-[16ch] text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[1] tracking-[-0.04em]">
            Questions?
            <br />
            <span className="text-[#FF4D1F]">Answered.</span>
          </h2>
        </div>

        <p className="max-w-xl text-base font-medium leading-relaxed text-[#16151A]/65 sm:text-[18px] lg:justify-self-end lg:pb-2">
          Everything you need to know about working with Upto and moving
          your freight forward.
        </p>
      </div>

      {/* FAQ accordion */}
      <div className="faq-reveal border-t border-[#16151A]/20">
        {FAQS.map((faq, index) => {
          const isOpen = activeIndex === index;
          const answerId = `faq-answer-${index}`;

          return (
            <div
              key={faq.question}
              className="border-b border-[#16151A]/20"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() =>
                  setActiveIndex(isOpen ? null : index)
                }
                className="group flex w-full items-center gap-5 py-6 text-left sm:py-8"
              >
                <span className="w-8 shrink-0 text-sm font-medium tabular-nums text-[#FF4D1F] sm:w-10">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <span
                  className={`flex-1 text-[clamp(1.1rem,2.4vw,2rem)] font-bold leading-[1.15] tracking-[-0.035em] transition-colors duration-300 ${
                    isOpen
                      ? "text-[#FF4D1F]"
                      : "text-[#16151A] group-hover:text-[#FF4D1F]"
                  }`}
                >
                  {faq.question}
                </span>

                <span
                  aria-hidden="true"
                  className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-[#16151A]/20 transition-colors duration-300 group-hover:border-[#FF4D1F] sm:size-11"
                >
                  <span className="absolute h-px w-3.5 bg-current sm:w-4" />
                  <span
                    className={`absolute h-3.5 w-px bg-current transition-transform duration-300 sm:h-4 ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </span>
              </button>

              <div
                id={answerId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`pb-7 pl-13 pr-12 text-base font-medium leading-relaxed text-[#16151A]/65 transition-opacity duration-300 sm:pb-8 sm:pl-14 sm:pr-16 sm:text-[18px] ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
