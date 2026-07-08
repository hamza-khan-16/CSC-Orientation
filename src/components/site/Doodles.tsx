type P = { className?: string; style?: React.CSSProperties };
export function Star({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2 6 6 1-4.5 4 1.2 6L12 17l-4.7 3 1.2-6L4 10l6-1 2-6z" />
    </svg>
  );
}
export function Squiggle({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 120 20" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M2 10 C 12 2, 22 18, 32 10 S 52 2, 62 10 82 18, 92 10 112 2, 118 10" />
    </svg>
  );
}
export function Arrow({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8 C 30 8, 40 50, 96 46" />
      <path d="M86 38 L98 46 L88 54" />
    </svg>
  );
}
export function Bulb({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0012 3z" />
    </svg>
  );
}
export function Plane({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20 L37 4 L28 37 L20 24 L3 20 Z" />
      <path d="M20 24 L37 4" />
    </svg>
  );
}
export function Scribble({ className = "", stroke = "currentColor", style }: P & { stroke?: string }) {
  return (
    <svg viewBox="0 0 300 30" className={className} style={style} fill="none" preserveAspectRatio="none">
      <path d="M4 22 C 60 4, 120 30, 180 12 S 280 8, 296 20" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}