/** The Halodial mark, inline so its bright arc can turn (the nav turns it as you scroll). */
export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 100 100" fill="none" strokeLinecap="round" aria-hidden="true">
      <path d="M80.56 35.09A34 34 0 1 1 19.44 35.09" stroke="#fff" strokeOpacity=".26" strokeWidth="8" />
      <path className="logo-arc" d="M28.15 23.96A34 34 0 0 1 71.85 23.96" stroke="#fff" strokeWidth="8" />
      <circle cx="50" cy="50" r="7" fill="#fff" />
    </svg>
  );
}
