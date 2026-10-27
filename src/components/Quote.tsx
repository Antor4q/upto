"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = ["Air", "Sea", "Road", "Warehousing"];
const PORTS = ["Singapore", "Rotterdam", "Shanghai", "Dubai", "Chittagong", "Los Angeles", "New York", "Santos", "Lagos", "Durban", "Sydney"];
const CARGO = ["General cargo", "Perishables", "Machinery", "Electronics", "Hazardous goods", "Other"];
const SIZES = ["20 ft container", "40 ft container", "Part load (LCL)", "Not sure yet"];
// Swap for a real photo any time: drop it in /public/images and change this path.
const BG = "/Quotebg.svg";
const PROMISES = ["A reply within 24 hours", "One clear price, no hidden fees", "Live tracking from day one"];

const input =
  "h-14 w-full border-2 bg-white px-4 text-base font-medium placeholder:opacity-40 focus-visible:outline-4 focus-visible:outline-[#FF4D1F]";

type Values = {
  service: string; from: string; to: string; cargo: string; weight: string;
  size: string; date: string; name: string; email: string; notes: string;
};
const EMPTY: Values = {
  service: "Sea", from: "", to: "", cargo: CARGO[0], weight: "", size: SIZES[1],
  date: "", name: "", email: "", notes: "",
};

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && <span className="font-medium opacity-60"> (optional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-semibold text-[#C2260A]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Quote() {
  const root = useRef<HTMLElement>(null);
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ ref: string; name: string; email: string } | null>(null);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const aria = (k: keyof Values) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `q-${k}-err` : undefined });
  const border = (k: keyof Values) => (errors[k] ? "border-[#C2260A]" : "border-[#16151A]");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<keyof Values, string>> = {};
    if (v.date) {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (v.date < todayStr) err.date = "Pick today or a later date.";
    }
    if (!v.from.trim()) err.from = "Where is the cargo starting from?";
    if (!v.to.trim()) err.to = "Where is it going?";
    if (!(Number(v.weight) > 0)) err.weight = "Enter the weight in kg.";
    if (!v.name.trim()) err.name = "Tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) err.email = "Enter a valid email address.";
    setErrors(err);
    const first = Object.keys(err)[0];
    if (first) {
      document.getElementById(`q-${first}`)?.focus();
      return;
    }
    setSending(true);
    // Demo only: replace this timeout with a POST to your API / email service.
    setTimeout(() => {
      setDone({ ref: `Q-${Math.floor(10000 + Math.random() * 90000)}`, name: v.name.trim(), email: v.email.trim() });
      setSending(false);
    }, 900);
  };

  // Scroll reveal
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".q-in", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root }
  );

  // Confirmation reveal
  useGSAP(
    () => {
      if (!done) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".q-done > *", { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
      });
    },
    { scope: root, dependencies: [done] }
  );

  return (
    <section id="quote" ref={root} className="relative isolate overflow-hidden bg-[#16151A] px-[4vw] py-28 text-white">
      <Image src={BG} alt="" aria-hidden fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#16151A]/90 via-[#16151A]/75 to-[#16151A]/55" />
      <div className="relative grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        {/* Left: pitch */}
        <div>
          <h2 className="q-in text-[clamp(3rem,8vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            Get a
            <br />
            <span className="text-[#FF4D1F]">quote.</span>
          </h2>
          <p className="q-in mt-6 max-w-md text-[18px] font-medium leading-relaxed">
            Tell us what you’re shipping and where it needs to go. We’ll come back with a clear price and a delivery date.
          </p>
          <ul className="q-in mt-8 space-y-3">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[18px] font-medium">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#FF4D1F]" aria-hidden>
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="#16151A" strokeWidth="2.2">
                    <path d="m3 8.5 3.2 3L13 4.5" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form card */}
        <div className="q-in bg-white p-6 text-[#16151A] md:p-8" aria-live="polite">
          {done ? (
            <div className="q-done grid min-h-[30rem] place-items-center text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#FF4D1F]" aria-hidden>
                  <svg viewBox="0 0 16 16" className="size-8" fill="none" stroke="#16151A" strokeWidth="2">
                    <path d="m3 8.5 3.2 3L13 4.5" />
                  </svg>
                </span>
                <h3 className="mt-6 text-4xl font-extrabold tracking-[-0.04em]">Thanks, {done.name}.</h3>
                <p className="mx-auto mt-3 max-w-sm text-[18px] font-medium leading-relaxed opacity-70">
                  We’ll reply to {done.email} within 24 hours with your quote.
                </p>
                <p className="mt-6 text-sm font-semibold">
                  Reference <span className="ml-1 bg-[#16151A] px-2 py-1 text-white">{done.ref}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(null);
                    setV(EMPTY);
                    setErrors({});
                  }}
                  className="mt-8 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16151A]"
                >
                  Request another quote
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold">Service</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SERVICES.map((s) => (
                    <label key={s} className="relative">
                      <input type="radio" name="service" value={s} checked={v.service === s} onChange={set("service")} className="peer sr-only" />
                      <span className="block cursor-pointer border-2 border-[#16151A] px-3 py-3.5 text-center text-sm font-semibold transition-colors hover:bg-[#16151A]/10 peer-checked:bg-[#16151A] peer-checked:text-white peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#16151A]">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="q-from" label="From" error={errors.from}>
                  <input id="q-from" list="q-ports" value={v.from} onChange={set("from")} placeholder="City or port" autoComplete="off" {...aria("from")} className={`${input} ${border("from")}`} />
                </Field>
                <Field id="q-to" label="To" error={errors.to}>
                  <input id="q-to" list="q-ports" value={v.to} onChange={set("to")} placeholder="City or port" autoComplete="off" {...aria("to")} className={`${input} ${border("to")}`} />
                </Field>
                <datalist id="q-ports">
                  {PORTS.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>

                <Field id="q-cargo" label="Cargo type">
                  <select id="q-cargo" value={v.cargo} onChange={set("cargo")} className={`${input} border-[#16151A]`}>
                    {CARGO.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field id="q-weight" label="Weight" error={errors.weight}>
                  <div className="relative">
                    <input id="q-weight" type="number" min="0" inputMode="decimal" value={v.weight} onChange={set("weight")} placeholder="1200" {...aria("weight")} className={`${input} ${border("weight")} pr-12`} />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold opacity-60">kg</span>
                  </div>
                </Field>

                <Field id="q-size" label="Container">
                  <select id="q-size" value={v.size} onChange={set("size")} className={`${input} border-[#16151A]`}>
                    {SIZES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field id="q-date" label="Pickup date" optional error={errors.date}>
                  <input id="q-date" type="date" value={v.date} onChange={set("date")} {...aria("date")} className={`${input} ${border("date")}`} />
                </Field>

                <Field id="q-name" label="Your name" error={errors.name}>
                  <input id="q-name" value={v.name} onChange={set("name")} autoComplete="name" {...aria("name")} className={`${input} ${border("name")}`} />
                </Field>
                <Field id="q-email" label="Email" error={errors.email}>
                  <input id="q-email" type="email" value={v.email} onChange={set("email")} autoComplete="email" placeholder="you@company.com" {...aria("email")} className={`${input} ${border("email")}`} />
                </Field>
              </div>

              <Field id="q-notes" label="Anything we should know?" optional>
                <textarea id="q-notes" rows={3} value={v.notes} onChange={set("notes")} className={`${input} h-auto border-[#16151A] py-3`} />
              </Field>

              <button
                type="submit"
                disabled={sending}
                className="h-16 w-full bg-[#16151A] text-lg font-semibold text-white transition-colors hover:bg-[#FF4D1F] hover:text-[#16151A] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#16151A] disabled:opacity-60 motion-reduce:transition-none"
              >
                {sending ? "Sending…" : "Request quote"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}