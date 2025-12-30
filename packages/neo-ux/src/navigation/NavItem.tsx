"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon as LucideIcon } from "lucide-react";
import { GlowBadge } from "../components/GlowBadge";
import { neo } from "../theme";

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  moduleBadge?: string;
}

export function NavItem({ href, label, icon: Icon, moduleBadge }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
        ${active ? `bg-neutral-800 ${neo.glow.active}` : "text-neutral-300 hover:bg-neutral-800"}
      `}
    >
      <Icon size={18} className={active ? neo.colors.primary : neo.colors.dim} />
      <span className="font-medium flex items-center gap-2">
        {label}
        {moduleBadge && <GlowBadge label={moduleBadge} />}
      </span>
    </Link>
  );
}
