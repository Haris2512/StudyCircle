// Komponen ini merupakan bagian dari antarmuka pengguna
import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default" | "solid-warning" | "outline-warning" | "primary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-500/15 text-green-400 ring-green-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 ring-yellow-500/20",
  danger: "bg-red-500/15 text-red-400 ring-red-500/20",
  info: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  default: "bg-gray-500/15 text-gray-400 ring-gray-500/20",
  "solid-warning": "bg-yellow-400 text-black ring-yellow-400",
  "outline-warning": "bg-transparent text-yellow-400 ring-yellow-400",
  primary: "bg-primary-500/20 text-primary-400 ring-primary-500/30",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5 rounded-full
        text-xs font-medium
        ring-1 ring-inset
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
