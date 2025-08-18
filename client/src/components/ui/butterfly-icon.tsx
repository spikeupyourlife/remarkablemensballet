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
      <path d="M12 12C12 8 8 4 4 4C2 4 1 6 2 8C3 12 8 12 12 12Z" />
      
      {/* Upper right wing */}
      <path d="M12 12C12 8 16 4 20 4C22 4 23 6 22 8C21 12 16 12 12 12Z" />
      
      {/* Lower left wing */}
      <path d="M12 12C12 16 8 20 4 20C2 20 1 18 2 16C3 12 8 12 12 12Z" />
      
      {/* Lower right wing */}
      <path d="M12 12C12 16 16 20 20 20C22 20 23 18 22 16C21 12 16 12 12 12Z" />
      
      {/* Antennae */}
      <path d="M11 2L9 1" />
      <path d="M13 2L15 1" />
    </svg>
  );
}