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
      {/* Butterfly body - vertical center line */}
      <line x1="12" y1="4" x2="12" y2="20" />
      
      {/* Upper left wing */}
      <path d="M12 8C8 4 4 4 2 8C2 10 4 12 8 12C10 12 11 10 12 8Z" />
      
      {/* Upper right wing */}
      <path d="M12 8C16 4 20 4 22 8C22 10 20 12 16 12C14 12 13 10 12 8Z" />
      
      {/* Lower left wing */}
      <path d="M12 16C8 20 4 20 2 16C2 14 4 12 8 12C10 12 11 14 12 16Z" />
      
      {/* Lower right wing */}
      <path d="M12 16C16 20 20 20 22 16C22 14 20 12 16 12C14 12 13 14 12 16Z" />
      
      {/* Antennae */}
      <path d="M10 4L8 2" />
      <path d="M14 4L16 2" />
    </svg>
  );
}