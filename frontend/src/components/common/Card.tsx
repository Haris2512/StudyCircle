// Komponen ini merupakan bagian dari antarmuka pengguna
import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  "aria-label"?: string;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  onClick,
  hoverable = false,
  "aria-label": ariaLabel,
}) => {
  const isClickable = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      className={`
        rounded-2xl
        transition-all duration-300
        glass-panel
        ${hoverable ? "glass-panel-hover cursor-pointer hover:-translate-y-1" : ""}
        ${isClickable && !hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
