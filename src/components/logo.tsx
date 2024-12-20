export function Logo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dumbbell */}
      <path
        d="M6.5 12H17.5M7.5 9V15M16.5 9V15M5 10.5V13.5M19 10.5V13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-400"
      />
      
      {/* Circular glow effect */}
      <circle
        cx="12"
        cy="12"
        r="9"
        className="stroke-primary-500/20"
        strokeWidth="2"
      />
    </svg>
  )
}
