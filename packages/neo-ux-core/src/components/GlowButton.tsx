import { ReactNode, ButtonHTMLAttributes } from "react";
import { neo } from "../theme";

export interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "gradient" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export function GlowButton({ children, variant = "default", size = "md", className = "", ...props }: GlowButtonProps) {
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const variantClasses: Record<string, string> = {
    default: `bg-neutral-800 hover:bg-neutral-700 text-neutral-200 ${neo.glow.active}`,
    gradient: `bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white ${neo.glow.active}`,
    outline: `border border-neutral-600 bg-transparent hover:bg-neutral-800 text-neutral-200`,
    danger: `bg-red-700 hover:bg-red-600 text-white`,
  };
  return (
    <button
      {...props}
      className={`rounded-md ${sizeClasses[size] ?? sizeClasses.md} ${variantClasses[variant] ?? variantClasses.default} ${className}`}
    >
      {children}
    </button>
  );
}
