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
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Upper left wing */}
      <path d="M12 12C11 9 8 6 4 6.5C2.5 7 2 9 3 10.5C5 11.5 8.5 12 12 12Z" />
      
      {/* Upper right wing */}
      <path d="M12 12C13 9 16 6 20 6.5C21.5 7 22 9 21 10.5C19 11.5 15.5 12 12 12Z" />
      
      {/* Lower left wing */}
      <path d="M12 12C11 15 8 18 4 17.5C2.5 17 2 15 3 13.5C5 12.5 8.5 12 12 12Z" />
      
      {/* Lower right wing */}
      <path d="M12 12C13 15 16 18 20 17.5C21.5 17 22 15 21 13.5C19 12.5 15.5 12 12 12Z" />
      
      {/* Antennae */}
      <path d="M11.5 8L10.5 5" />
      <path d="M12.5 8L13.5 5" />
    </svg>
  );
}