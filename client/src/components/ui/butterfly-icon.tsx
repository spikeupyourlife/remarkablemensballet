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
      {/* Body - elongated oval center */}
      <path d="M12 6C11.5 6 11 6.5 11 7L11 17C11 17.5 11.5 18 12 18C12.5 18 13 17.5 13 17L13 7C13 6.5 12.5 6 12 6Z" fill="currentColor" />
      
      {/* Upper left wing - outer curve */}
      <path d="M12 8C9 4 4 3 1 7C0 9 2 11 6 12C9 12.5 12 10 12 8Z" />
      {/* Upper left wing - inner detail */}
      <path d="M12 8C10 6 7 5.5 5 7.5C4.5 8.5 5.5 9.5 7.5 10C9 10.5 12 9 12 8Z" />
      
      {/* Upper right wing - outer curve */}
      <path d="M12 8C15 4 20 3 23 7C24 9 22 11 18 12C15 12.5 12 10 12 8Z" />
      {/* Upper right wing - inner detail */}
      <path d="M12 8C14 6 17 5.5 19 7.5C19.5 8.5 18.5 9.5 16.5 10C15 10.5 12 9 12 8Z" />
      
      {/* Lower left wing - outer curve */}
      <path d="M12 16C9 20 4 21 1 17C0 15 2 13 6 12C9 11.5 12 14 12 16Z" />
      {/* Lower left wing - inner detail */}
      <path d="M12 16C10 18 7 18.5 5 16.5C4.5 15.5 5.5 14.5 7.5 14C9 13.5 12 15 12 16Z" />
      
      {/* Lower right wing - outer curve */}
      <path d="M12 16C15 20 20 21 23 17C24 15 22 13 18 12C15 11.5 12 14 12 16Z" />
      {/* Lower right wing - inner detail */}
      <path d="M12 16C14 18 17 18.5 19 16.5C19.5 15.5 18.5 14.5 16.5 14C15 13.5 12 15 12 16Z" />
      
      {/* Antennae */}
      <path d="M11 6L9 3" />
      <path d="M13 6L15 3" />
    </svg>
  );
}