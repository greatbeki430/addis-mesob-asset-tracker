export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f3d73" />
      <path
        d="M32 12 14 19v13c0 10.5 7.4 17.6 18 21 10.6-3.4 18-10.5 18-21V19L32 12Z"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="m24 32 6 6 11-12" fill="none" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
