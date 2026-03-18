import { ReactNode, ButtonHTMLAttributes } from "react";
import { neo } from "../theme";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "gradient" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GlowButton({ children, variant = "default", size = "md", className = "", ...props }: GlowButtonProps) {
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses: Record<string, string> = {
    default: `bg-neutral-800 hover:bg-neutral-700 text-neutral-200 ${neo.glow.active}`,
    gradient: `bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white ${neo.glow.active}`,
    outline: `border border-neutral-600 hover:border-neutral-400 text-neutral-200 bg-transparent`,
    ghost: `hover:bg-neutral-800 text-neutral-300 bg-transparent`,
  };

  return (
    <button
      {...props}
      className={`rounded-md ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
