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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Upper left wing */}
      <path d="M12 12C10 8 6 5 2 6C1 7 1 10 3 11C6 12 9 12 12 12Z" />
      
      {/* Upper right wing */}
      <path d="M12 12C14 8 18 5 22 6C23 7 23 10 21 11C18 12 15 12 12 12Z" />
      
      {/* Lower left wing */}
      <path d="M12 12C10 16 6 19 2 18C1 17 1 14 3 13C6 12 9 12 12 12Z" />
      
      {/* Lower right wing */}
      <path d="M12 12C14 16 18 19 22 18C23 17 23 14 21 13C18 12 15 12 12 12Z" />
      
      {/* Antennae */}
      <path d="M11 7L10 4" />
      <path d="M13 7L14 4" />
    </svg>
  );
}