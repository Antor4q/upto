"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PORT_NAMES = ["Singapore", "Rotterdam", "Shanghai", "Dubai", "Chittagong", "Los Angeles", "New York", "Santos", "Lagos", "Durban", "Sydney"];
const SAMPLES = ["UP-48213", "UP-90517"];
const ROW = 5; // rem height of one timeline row (h-20)

type Step = { title: string; detail: string; date: string };
type Result = { id: string; origin: string; dest: string; size: string; stage: number; eta: string; steps: Step[] };

// Demo only: builds a believable shipment from the ID. Replace with a real API call.
function lookup(raw: string): Result | null {
  const m = raw.trim().toUpperCase().match(/^UP-?(\d{4,6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const oi = n % PORT_NAMES.length;
  let di = (n * 7 + 3) % PORT_NAMES.length;
  if (di === oi) di = (di + 1) % PORT_NAMES.length;
  const origin = PORT_NAMES[oi];
  const dest = PORT_NAMES[di];
  const stage = 1 + (n % 3); // 1..3
  const fmt = (i: number) =>
    new Date(Date.now() + (i - stage) * 2 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const base = [
    { title: "Booked", detail: "Order confirmed" },
    { title: "Picked up", detail: `Collected near ${origin}` },
    { title: "In transit", detail: `${origin} to ${dest}` },
    { title: "Customs", detail: `Clearance at ${dest}` },
    { title: "Delivered", detail: "Handed over at the dock" },
  ];
  const steps = base.map((s, i) => ({ ...s, date: (i > stage ? "Est. " : "") + fmt(i) }));
  return { id: `UP-${m[1]}`, origin, dest, stage, size: n % 2 ? "40 ft container" : "20 ft container", eta: steps[4].date.replace("Est. ", ""), steps };
}

export default function Tracking() {
  const root = useRef<HTMLElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = (raw: string) => {
    const found = lookup(raw);
    if (!found) {
      setError("Enter an ID like UP-48213.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setResult(found);
      setLoading(false);
    }, 800);
  };

  useGSAP(
    () => {
      if (!result) return;
      const q = gsap.utils.selector(root);
      const s = result.stage;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(q(".trk-sum"), { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
        gsap.from(q(".trk-row"), { opacity: 0, x: -16, duration: 0.5, stagger: 0.08, ease: "power3.out" });
        gsap.fromTo(q(".trk-fill"), { scaleY: 0 }, { scaleY: s / 4, duration: s * 0.5, ease: "none", delay: 0.3 });
        gsap.fromTo(q(".trk-icon"), { y: 0 }, { y: s * ROW * rem, duration: s * 0.5, ease: "none", delay: 0.3 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".trk-fill"), { scaleY: s / 4 });
        gsap.set(q(".trk-icon"), { y: s * ROW * rem });
      });
    },
    { scope: root, dependencies: [result], revertOnUpdate: true }
  );

  return (
    <section id="tracking" ref={root} className="bg-white px-[4vw] py-28 text-[#16151A]">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Left: heading + form */}
        <div>
          <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em]">
            Where’s
            <br />
            my cargo?
          </h2>
          <p className="mt-6 max-w-md text-[18px] font-medium leading-relaxed opacity-70">
            Enter your tracking ID to see exactly where your container is, and when it lands.
          </p>

          <form
            noValidate
            className="mt-10"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
            }}
          >
            <label htmlFor="trk-id" className="text-sm font-semibold">
              Tracking ID
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="trk-id"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="UP-48213"
                autoComplete="off"
                aria-invalid={!!error}
                aria-describedby="trk-error"
                className="h-16 w-full border-2 border-[#16151A] bg-white px-5 text-xl font-semibold uppercase tracking-tight placeholder:opacity-40 focus-visible:outline-4 focus-visible:outline-[#FF4D1F]"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-16 shrink-0 bg-[#FF4D1F] px-8 font-semibold text-[#16151A] transition-colors hover:bg-[#16151A] hover:text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#16151A] disabled:opacity-60"
              >
                {loading ? "Tracking…" : "Track"}
              </button>
            </div>
            <p id="trk-error" role="alert" className="mt-3 min-h-6 text-sm font-semibold text-[#C2260A]">
              {error}
            </p>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="opacity-70">Try a sample:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setValue(s);
                  run(s);
                }}
                className="border border-[#16151A]/30 px-3 py-1.5 transition-colors hover:border-[#16151A] hover:bg-[#16151A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4D1F]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right: result panel */}
        <div className="min-h-[34rem] bg-[#16151A] p-6 text-white md:p-8" aria-live="polite">
          {!result ? (
            <div className="grid h-full min-h-[30rem] place-items-center border-2 border-dashed border-white/20 p-6 text-center">
              <div>
                <svg viewBox="0 0 64 40" className="mx-auto w-24 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="4" y="6" width="56" height="28" />
                  {Array.from({ length: 9 }, (_, i) => (
                    <line key={i} x1={10 + i * 5.5} y1="10" x2={10 + i * 5.5} y2="30" />
                  ))}
                </svg>
                <p className="mt-4 text-[18px] font-medium opacity-70">Your shipment will show up here.</p>
              </div>
            </div>
          ) : (
            <div key={result.id}>
              <p className="sr-only">
                Showing shipment {result.id}, currently {result.steps[result.stage].title}.
              </p>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="trk-sum">
                  <p className="text-sm font-medium opacity-70">Shipment</p>
                  <p className="text-3xl font-extrabold tracking-[-0.03em]">{result.id}</p>
                </div>
                <p className="trk-sum bg-[#FF4D1F] px-3 py-1.5 text-sm font-semibold text-[#16151A]">
                  {result.steps[result.stage].title}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-white/15 py-5 text-sm">
                {[
                  ["Route", `${result.origin} to ${result.dest}`],
                  ["Container", result.size],
                  ["Arrives", result.eta],
                ].map(([k, v]) => (
                  <div key={k} className="trk-sum">
                    <dt className="opacity-70">{k}</dt>
                    <dd className="mt-1 text-base font-semibold leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>

              <ol className="relative mt-8">
                <span aria-hidden className="absolute left-[11px] top-[11px] h-[calc(100%-5rem)] w-0.5 bg-white/20" />
                <span aria-hidden className="trk-fill absolute left-[11px] top-[11px] h-[calc(100%-5rem)] w-0.5 origin-top bg-[#FF4D1F]" />
                <svg
                  aria-hidden
                  viewBox="0 0 32 20"
                  className="trk-icon absolute -left-1 top-0.5 z-10 h-5 w-8"
                >
                  <rect width="32" height="20" rx="2" fill="#FF4D1F" />
                  {[6, 11, 16, 21, 26].map((x) => (
                    <line key={x} x1={x} y1="3" x2={x} y2="17" stroke="#16151A" strokeOpacity=".3" strokeWidth="1.5" />
                  ))}
                </svg>
                {result.steps.map((st, i) => {
                  const done = i <= result.stage;
                  return (
                    <li key={st.title} className="trk-row relative flex h-20 items-start gap-4 pl-10">
                      <span
                        aria-hidden
                        style={{ transitionDelay: `${0.3 + i * 0.5}s` }}
                        className={`absolute left-0 top-0 size-6 rounded-full border-2 transition-colors duration-300 motion-reduce:!delay-0 motion-reduce:transition-none ${
                          done ? "border-[#FF4D1F] bg-[#FF4D1F]" : "border-white/30 bg-[#16151A]"
                        }`}
                      />
                      <div className={done ? "" : "opacity-60"}>
                        <p className="text-lg font-semibold leading-6">{st.title}</p>
                        <p className="text-base font-medium opacity-70">{st.detail}</p>
                      </div>
                      <p className="ml-auto shrink-0 text-sm font-medium opacity-70">{st.date}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}