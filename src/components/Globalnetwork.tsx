"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORLD, COLS, ROWS, STEP, TOP_LAT } from "./Worlddots";

gsap.registerPlugin(ScrollTrigger);

const ORANGE = "255,77,31";
const TAU = Math.PI * 2;
const LAT_SPAN = ROWS * STEP; // degrees covered by the grid

type Port = { name: string; lat: number; lon: number };
const PORTS: Record<string, Port> = {
  sin: { name: "Singapore", lat: 1.29, lon: 103.85 },
  rtm: { name: "Rotterdam", lat: 51.95, lon: 4.14 },
  shg: { name: "Shanghai", lat: 31.2, lon: 121.5 },
  dxb: { name: "Dubai", lat: 25.0, lon: 55.1 },
  ctg: { name: "Chittagong", lat: 22.33, lon: 91.8 },
  lax: { name: "Los Angeles", lat: 33.7, lon: -118.3 },
  nyc: { name: "New York", lat: 40.7, lon: -74 },
  ssz: { name: "Santos", lat: -23.96, lon: -46.3 },
  lag: { name: "Lagos", lat: 6.45, lon: 3.4 },
  dur: { name: "Durban", lat: -29.9, lon: 31 },
  syd: { name: "Sydney", lat: -33.9, lon: 151.2 },
};
const PORT_LIST = Object.values(PORTS);

// Routes avoid the antimeridian so every arc stays on one side of the map.
const ROUTES: [string, string][] = [
  ["sin", "rtm"],
  ["shg", "sin"],
  ["ctg", "dxb"],
  ["dxb", "dur"],
  ["rtm", "nyc"],
  ["nyc", "ssz"],
  ["lag", "ssz"],
  ["sin", "syd"],
  ["lax", "nyc"],
];

const toUnit = (p: Port) => ({ u: (p.lon + 180) / 360, v: (TOP_LAT - p.lat) / LAT_SPAN });

// Land dots in unit coordinates (0..1)
const DOTS: { u: number; v: number }[] = [];
WORLD.forEach((row, r) => {
  for (let c = 0; c < COLS; c++) if (row[c] === "1") DOTS.push({ u: (c + 0.5) / COLS, v: (r + 0.5) / ROWS });
});

export default function GlobalNetwork() {
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const box = wrap.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(cv).fontFamily;

    const state = { map: reduce ? 1 : 0, routes: reduce ? 1 : 0 };
    const size = { w: 0, h: 0 };
    const mouse = { x: 0, y: 0, active: false };
    const routes = ROUTES.map(([a, b], i) => ({
      a: toUnit(PORTS[a]),
      b: toUnit(PORTS[b]),
      period: 9 + (i % 4) * 2.5,
      phase: i * 0.17,
    }));
    const ports = PORT_LIST.map(toUnit);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = box.clientWidth;
      size.h = (size.w * ROWS) / COLS;
      cv.width = size.w * dpr;
      cv.height = size.h * dpr;
      cv.style.width = `${size.w}px`;
      cv.style.height = `${size.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(0);
    };

    // Quadratic arc between two unit points, bulging upward
    const arc = (r: (typeof routes)[number]) => {
      const { w, h } = size;
      const x0 = r.a.u * w, y0 = r.a.v * h, x1 = r.b.u * w, y1 = r.b.v * h;
      const len = Math.hypot(x1 - x0, y1 - y0);
      return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 - len * 0.3 };
    };
    const at = (p: ReturnType<typeof arc>, t: number) => {
      const k = 1 - t;
      return { x: k * k * p.x0 + 2 * k * t * p.cx + t * t * p.x1, y: k * k * p.y0 + 2 * k * t * p.cy + t * t * p.y1 };
    };

    function draw(time: number) {
      const { w, h } = size;
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const rad = (w / COLS) * 0.3;
      const R = Math.max(70, w * 0.06);
      const hot: { x: number; y: number; k: number }[] = [];

      // land dots (batched), nearby ones glow orange under the cursor
      ctx.fillStyle = "rgba(255,255,255,.2)";
      ctx.beginPath();
      for (const d of DOTS) {
        if (d.u > state.map) continue;
        const x = d.u * w, y = d.v * h;
        if (mouse.active) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          if (dist < R) {
            hot.push({ x, y, k: 1 - dist / R });
            continue;
          }
        }
        ctx.moveTo(x + rad, y);
        ctx.arc(x, y, rad, 0, TAU);
      }
      ctx.fill();
      for (const d of hot) {
        ctx.fillStyle = `rgba(${ORANGE},${0.25 + d.k * 0.75})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, rad * (1 + d.k * 1.3), 0, TAU);
        ctx.fill();
      }

      // routes
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(${ORANGE},.6)`;
      const arcs = routes.map(arc);
      if (state.routes > 0) {
        arcs.forEach((p) => {
          ctx.beginPath();
          const steps = 48;
          const last = Math.floor(steps * state.routes);
          for (let i = 0; i <= last; i++) {
            const pt = at(p, i / steps);
            i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y);
          }
          ctx.stroke();
        });
      }

      // shipments moving along the arcs
      if (!reduce && state.routes >= 1) {
        arcs.forEach((p, i) => {
          const r = routes[i];
          for (let s = 0; s < 2; s++) {
            const t0 = (time / r.period + r.phase + s * 0.5) % 1;
            for (let tail = 0; tail < 6; tail++) {
              const t = t0 - tail * 0.012;
              if (t < 0) continue;
              const pt = at(p, t);
              ctx.fillStyle = `rgba(255,255,255,${0.9 - tail * 0.15})`;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3 - tail * 0.35, 0, TAU);
              ctx.fill();
            }
          }
        });
      }

      // ports: pulse + core + label
      ctx.font = `500 12px ${font}`;
      ctx.textBaseline = "middle";
      ports.forEach((p, i) => {
        const x = p.u * w, y = p.v * h;
        const over = mouse.active && Math.hypot(x - mouse.x, y - mouse.y) < 16;
        const alpha = Math.min(1, Math.max(0, (state.map - p.u) * 6));
        if (!alpha) return;
        if (!reduce) {
          const ph = (time * 0.5 + i * 0.13) % 1;
          ctx.strokeStyle = `rgba(${ORANGE},${(1 - ph) * 0.5 * alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 4 + ph * 14, 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${ORANGE},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, over ? 6 : 4, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(over ? 1 : 0.7) * alpha})`;
        ctx.fillText(PORT_LIST[i].name, x + 10, y - 10);
      });
    }

    const onMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    if (!reduce) {
      cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    // Run the render loop only while the section is on screen
    const loop = (time: number) => draw(time);
    const visible = ScrollTrigger.create({
      trigger: section.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (reduce) return;
        if (self.isActive) gsap.ticker.add(loop);
        else gsap.ticker.remove(loop);
      },
    });

    // Reveal: map sweeps left to right, then routes draw in
    const reveal = reduce
      ? null
      : ScrollTrigger.create({
          trigger: section.current,
          start: "top 60%",
          once: true,
          onEnter: () =>
            gsap
              .timeline()
              .to(state, { map: 1, duration: 1.8, ease: "power2.inOut" })
              .to(state, { routes: 1, duration: 2, ease: "power2.inOut" }, "-=0.5"),
        });

    return () => {
      gsap.ticker.remove(loop);
      visible.kill();
      reveal?.kill();
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="network" ref={section} className="bg-[#16151A] px-[4vw] py-28 text-white">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.05em]">
          One network.
          <br />
          Every port.
        </h2>
        <p className="max-w-sm text-[18px] font-medium leading-relaxed opacity-70">
          Containers move between the ports we work with every day. Hover the map to see where we operate.
        </p>
      </div>

      {/* On small screens the map scrolls sideways instead of shrinking to nothing */}
      <div className="mt-12 overflow-x-auto">
        <div ref={wrap} className="min-w-[760px]">
          <canvas
            ref={canvas}
            role="img"
            aria-label="Map of Upto shipping routes between major ports around the world"
            className="block"
          />
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium opacity-80">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#FF4D1F]" aria-hidden /> Port
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-[#FF4D1F]" aria-hidden /> Route
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white" aria-hidden /> Shipment in transit
        </li>
      </ul>
    </section>
  );
}