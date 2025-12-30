import { ReactNode, ButtonHTMLAttributes } from "react";
import { neo } from "../theme";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GlowButton({ children, ...props }: GlowButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 ${neo.glow.active}`}
    >
      {children}
    </button>
  );
}
