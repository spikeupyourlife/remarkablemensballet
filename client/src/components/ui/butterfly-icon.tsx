interface ButterflyIconProps {
  className?: string;
  size?: number;
}

export function ButterflyIcon({ className = "", size = 24 }: ButterflyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Butterfly body */}
      <line x1="12" y1="2" x2="12" y2="22" />
      
      {/* Left wing upper */}
      <path d="M12 6C10 4 8 3 6 4C4 5 3 7 4 9C5 11 7 12 9 11C10 10 11 8 12 6Z" />
      
      {/* Right wing upper */}
      <path d="M12 6C14 4 16 3 18 4C20 5 21 7 20 9C19 11 17 12 15 11C14 10 13 8 12 6Z" />
      
      {/* Left wing lower */}
      <path d="M12 14C10 16 8 17 6 16C4 15 3 13 4 11C5 9 7 8 9 9C10 10 11 12 12 14Z" />
      
      {/* Right wing lower */}
      <path d="M12 14C14 16 16 17 18 16C20 15 21 13 20 11C19 9 17 8 15 9C14 10 13 12 12 14Z" />
      
      {/* Antennae */}
      <path d="M10 2L8 0" />
      <path d="M14 2L16 0" />
    </svg>
  );
}