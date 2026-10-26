"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------
   Upto: Tracking section (#tracking), light mode
   Colors sampled from the site video: ink #16151A, orange #FF4C1E.
   Fake data only. Any ID shaped like UP-12345678 returns a shipment;
   the ID decides the route, mode and how far along it is.
---------------------------------------------------------------- */

const ROUTES = [
  { from: "Dhaka", to: "Rotterdam", mode: "Sea" },
  { from: "Chattogram", to: "Singapore", mode: "Sea" },
  { from: "Dhaka", to: "Dubai", mode: "Air" },
  { from: "Dhaka", to: "Frankfurt", mode: "Air" },
  { from: "Benapole", to: "Kolkata", mode: "Road" },
] as const;

const SAMPLE_ID = "UP-48213907";
const ID_PATTERN = /^UP-?(\d{8})$/i;

type Shipment = {
  id: string;
  from: string;
  to: string;
  mode: "Sea" | "Air" | "Road";
  stage: number; // steps completed (2 to 6)
};

function lookup(raw: string): Shipment | null {
  const match = raw.trim().match(ID_PATTERN);
  if (!match) return null;
  const digits = match[1];
  let hash = 0;
  for (const ch of digits) hash = (hash * 31 + ch.charCodeAt(0)) % 9973;
  const route = ROUTES[hash % ROUTES.length];
  return { id: `UP-${digits}`, ...route, stage: 2 + (hash % 5) };
}

function stepsFor(s: Shipment) {
  const mid =
    s.mode === "Sea" ? "At sea" : s.mode === "Air" ? "In the air" : "On the road";
  return [
    { label: "Booking confirmed", place: s.from },
    { label: "Picked up from shipper", place: s.from },
    { label: "Export customs cleared", place: s.from },
    { label: `Departed ${s.from} hub`, place: s.from },
    { label: mid, place: `${s.from} to ${s.to}` },
    { label: "Delivered", place: s.to },
  ];
}

function dateFor(stepIndex: number, stage: number) {
  const d = new Date();
  d.setDate(d.getDate() + (stepIndex - (stage - 1)) * 2);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Tracking() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [lit, setLit] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  function run(raw: string) {
    if (timer.current) clearInterval(timer.current);
    const found = lookup(raw);
    if (!found) {
      setShipment(null);
      setError(
        `Tracking IDs look like ${SAMPLE_ID}: UP, then 8 digits. Check the number and try again.`
      );
      return;
    }
    setError("");
    setValue(found.id);
    setShipment(found);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(found.stage);
      return;
    }
    setLit(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setLit(n);
      if (n >= found.stage && timer.current) clearInterval(timer.current);
    }, 380);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(value);
  }

  const steps = shipment ? stepsFor(shipment) : [];
  const total = steps.length;
  const delivered = shipment ? shipment.stage >= total : false;
  const settled = shipment ? lit >= shipment.stage : false;
  const progress = shipment ? Math.min(lit, total) / total : 0;

  return (
    <section
      id="tracking"
      className="bg-white py-28 text-[var(--ink)]"
      style={{ "--ink": "#16151A", "--orange": "#FF4C1E" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading row, same rhythm as Services */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-6xl font-extrabold leading-[0.92] tracking-tighter md:text-8xl">
            Where&rsquo;s
            <br />
            your cargo?
          </h2>
          <p className="max-w-xs text-lg font-medium text-[var(--ink)]/65">
            Enter your tracking ID to see every stop between pickup and delivery.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate className="mt-16">
          <label htmlFor="tracking-id" className="mb-3 block text-base font-semibold">
            Tracking ID
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              id="tracking-id"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={SAMPLE_ID}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!!error}
              aria-describedby={error ? "tracking-error" : undefined}
              className="h-16 flex-1 rounded-full border-2 border-[var(--ink)] bg-transparent px-8 text-xl font-semibold outline-none transition-colors placeholder:font-medium placeholder:text-[var(--ink)]/30 focus:border-[var(--orange)] aria-[invalid=true]:border-red-600"
            />
            <button
              type="submit"
              className="h-16 rounded-full bg-[var(--orange)] px-10 text-lg font-bold text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] motion-reduce:transition-none"
            >
              Track shipment
            </button>
          </div>

          {error && (
            <p id="tracking-error" role="alert" className="mt-4 text-base font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => run(SAMPLE_ID)}
            className="mt-5 text-base font-medium text-[var(--ink)]/60 underline decoration-[var(--ink)]/25 underline-offset-4 transition-colors hover:text-[var(--orange)] hover:decoration-[var(--orange)]"
          >
            No ID handy? Try {SAMPLE_ID}
          </button>
        </form>

        {/* Result */}
        <div aria-live="polite" className="mt-16">
          {!shipment ? (
            <div className="border-t-2 border-[var(--ink)]/15 pt-8">
              <p className="max-w-sm text-lg font-medium text-[var(--ink)]/45">
                Your shipment&rsquo;s route and timeline will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
              {/* Summary card, dark like the Services cards */}
              <div className="self-start rounded-3xl bg-[var(--ink)] p-8 text-white">
                <p className="text-base text-white/55">Shipment {shipment.id}</p>
                <p className="mt-4 text-4xl font-extrabold leading-[1] tracking-tighter">
                  {shipment.from}
                  <br />
                  to {shipment.to}
                </p>
                <p className="mt-4 text-base text-white/55">{shipment.mode} freight</p>

                <div
                  className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/15"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={Math.min(lit, total)}
                  aria-label="Shipment progress"
                >
                  <div
                    className="h-full rounded-full bg-[var(--orange)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <p className="mt-8 text-base text-white/55">
                  {delivered ? "Status" : "Estimated delivery"}
                </p>
                <p className="mt-1 text-4xl font-extrabold tracking-tighter text-[var(--orange)]">
                  {delivered ? "Delivered" : dateFor(total - 1, shipment.stage)}
                </p>
              </div>

              {/* Ruled timeline, echoes the About section */}
              <ol>
                {steps.map((step, i) => {
                  const done = i < lit;
                  const current = settled && !delivered && i === shipment.stage;
                  return (
                    <li
                      key={step.label}
                      className={`grid grid-cols-[6.5rem_1fr_auto] items-start gap-x-6 border-t-2 py-6 transition-colors duration-500 motion-reduce:transition-none md:grid-cols-[9rem_1fr_auto] ${
                        done ? "border-[var(--orange)]" : "border-[var(--ink)]/15"
                      }`}
                    >
                      <p
                        className={`text-3xl font-extrabold leading-none tracking-tighter tabular-nums transition-colors duration-500 md:text-4xl ${
                          current
                            ? "text-[var(--orange)]"
                            : done
                            ? "text-[var(--ink)]"
                            : "text-[var(--ink)]/30"
                        }`}
                      >
                        {dateFor(i, shipment.stage)}
                      </p>
                      <div>
                        <p
                          className={`text-xl font-bold ${
                            done || current ? "text-[var(--ink)]" : "text-[var(--ink)]/40"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p
                          className={`text-base ${
                            done || current ? "text-[var(--ink)]/60" : "text-[var(--ink)]/30"
                          }`}
                        >
                          {step.place}
                          {!done && !current && " · Estimated"}
                        </p>
                      </div>
                      {current && (
                        <span className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-1.5 text-sm font-semibold text-white">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-70 motion-safe:animate-ping" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--orange)]" />
                          </span>
                          Now
                        </span>
                      )}
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