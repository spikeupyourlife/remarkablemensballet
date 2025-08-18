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
      {/* Body - vertical center line */}
      <line x1="12" y1="6" x2="12" y2="18" />
      
      {/* Upper left wing */}
      <path d="M12 9C8 6 4 6 2 9C2 11 4 12 8 12C10 12 12 10 12 9Z" />
      
      {/* Upper right wing */}
      <path d="M12 9C16 6 20 6 22 9C22 11 20 12 16 12C14 12 12 10 12 9Z" />
      
      {/* Lower left wing */}
      <path d="M12 15C8 18 4 18 2 15C2 13 4 12 8 12C10 12 12 14 12 15Z" />
      
      {/* Lower right wing */}
      <path d="M12 15C16 18 20 18 22 15C22 13 20 12 16 12C14 12 12 14 12 15Z" />
      
      {/* Antennae */}
      <path d="M11 6L9 3" />
      <path d="M13 6L15 3" />
    </svg>
  );
}