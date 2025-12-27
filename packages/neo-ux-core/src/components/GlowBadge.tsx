"use client";

export function GlowBadge({
  label,
  color = "text-emerald-400"
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      className={\`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide \${color}\`}
    >
      {label}
    </span>
  );
}
