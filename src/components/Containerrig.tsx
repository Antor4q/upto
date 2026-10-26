// Crane cable + hook + wires + container, all inline SVG (no image assets needed).
// Replace with a transparent PNG/WebP render later if you want photoreal.

const INK = "#16151A";
const ORANGE = "#FF4D1F";

export default function ContainerRig() {
  const frontRibs = Array.from({ length: 28 }, (_, i) => 46 + i * 12);
  const sideRibs = Array.from({ length: 7 }, (_, i) => (i + 1) / 8);

  return (
    <svg viewBox="0 0 520 560" className="h-auto w-full overflow-visible" role="img" aria-label="Shipping container lifted by a crane">
      {/* cable + hook */}
      <line x1="260" y1="-500" x2="260" y2="150" stroke={INK} strokeWidth="3" />
      <rect x="242" y="150" width="36" height="24" rx="4" fill={INK} />
      <circle cx="260" cy="150" r="12" fill={INK} />
      <path d="M260 174 v14 a10 10 0 1 0 10 10" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />

      {/* wires */}
      <line x1="264" y1="196" x2="50" y2="290" stroke={INK} strokeWidth="1.5" />
      <line x1="264" y1="196" x2="470" y2="252" stroke={INK} strokeWidth="1.5" />

      {/* container */}
      <g transform="translate(0,230)">
        {/* top */}
        <polygon points="40,60 140,20 480,20 380,60" fill="#ECEAE5" />
        {/* side */}
        <polygon points="380,60 480,20 480,220 380,260" fill="#BFBDB7" />
        {sideRibs.map((t) => (
          <line key={t} x1={380 + 100 * t} y1={70 - 40 * t} x2={380 + 100 * t} y2={250 - 40 * t} stroke="rgba(0,0,0,.14)" strokeWidth="2" />
        ))}
        <polygon points="404,50 434,38 434,198 404,210" fill={ORANGE} opacity=".9" />

        {/* front */}
        <rect x="40" y="60" width="340" height="200" fill="#DAD8D3" />
        {frontRibs.map((x) => (
          <g key={x}>
            <line x1={x} y1="72" x2={x} y2="248" stroke="rgba(0,0,0,.12)" strokeWidth="2.5" />
            <line x1={x + 3} y1="72" x2={x + 3} y2="248" stroke="rgba(255,255,255,.55)" strokeWidth="1" />
          </g>
        ))}

        {/* livery */}
        <text x="58" y="150" fontSize="44" fontWeight="800" letterSpacing="-2" fill={ORANGE}>Upto</text>
        <text x="60" y="172" fontSize="11" fontWeight="500" fill="#6b6a66">Freight, lifted.</text>
        <polygon points="210,80 265,80 225,240 170,240" fill={ORANGE} />
        <polygon points="280,80 335,80 295,240 240,240" fill={ORANGE} />

        {/* frame rails + posts */}
        <rect x="40" y="60" width="340" height="9" fill="#A9A7A1" />
        <rect x="40" y="251" width="340" height="9" fill="#A9A7A1" />
        <rect x="40" y="60" width="9" height="200" fill="#A9A7A1" />
        <rect x="371" y="60" width="9" height="200" fill="#A9A7A1" />
      </g>
    </svg>
  );
}