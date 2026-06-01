import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#0B0F19]/40 backdrop-blur-xl rounded-xl
        border border-white/5
        shadow-xl shadow-black/40
        transition-all duration-300
        ${hoverable ? "hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/10 hover:bg-[#0B0F19]/60 cursor-pointer" : ""}
        ${onClick && !hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
