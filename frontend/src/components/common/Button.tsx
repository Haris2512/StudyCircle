import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  "aria-pressed"?: boolean;
  "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-bg hover:from-primary-400 hover:to-secondary-pink focus:ring-primary-500 shadow-[0_0_15px_rgba(203,166,247,0.4)] hover:shadow-[0_0_25px_rgba(203,166,247,0.6)] font-bold",
  secondary:
    "bg-white/5 text-white hover:bg-white/10 focus:ring-gray-500 border border-white/10 backdrop-blur-md hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)]",
  danger:
    "bg-red-500/80 text-white hover:bg-red-500 focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]",
  ghost:
    "bg-transparent text-gray-300 hover:text-white hover:bg-white/10 focus:ring-gray-500 transition-colors",
  outline:
    "bg-transparent border border-white/20 text-gray-300 hover:text-white hover:border-primary-500 hover:bg-primary-500/10 hover:shadow-[0_0_15px_rgba(203,166,247,0.2)] focus:ring-primary-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-6 py-3 text-base rounded-full gap-2.5",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  className = "",
  autoFocus,
  "aria-pressed": ariaPressed,
  "aria-label": ariaLabel,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      autoFocus={autoFocus}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.95] hover:-translate-y-0.5"}
        ${className}
      `}
    >
      {loading && (
        <>
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="sr-only">Memuat...</span>
        </>
      )}
      {children}
    </button>
  );
};
