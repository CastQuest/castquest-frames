"use client";

import "./globals.css";
import { ReactNode } from "react";
import { GlowPanel } from "@castquest/neo-ux-core";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-200">
        <GlowPanel>
          {children}
        </GlowPanel>
      </body>
    </html>
  );
}
