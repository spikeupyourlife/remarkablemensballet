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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Upper left wing - organic flowing shape */}
      <path d="M12 12C10 8 6 5 3 6C1 7 1 9 2 11C4 13 8 12 12 12Z" />
      
      {/* Upper right wing - organic flowing shape */}
      <path d="M12 12C14 8 18 5 21 6C23 7 23 9 22 11C20 13 16 12 12 12Z" />
      
      {/* Lower left wing - organic flowing shape */}
      <path d="M12 12C10 16 6 19 3 18C1 17 1 15 2 13C4 11 8 12 12 12Z" />
      
      {/* Lower right wing - organic flowing shape */}
      <path d="M12 12C14 16 18 19 21 18C23 17 23 15 22 13C20 11 16 12 12 12Z" />
      
      {/* Body center dot */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      
      {/* Antennae */}
      <path d="M11 7L9 4" />
      <path d="M13 7L15 4" />
    </svg>
  );
}