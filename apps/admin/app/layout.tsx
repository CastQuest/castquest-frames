"use client";

import "./globals.css";
import { ReactNode } from "react";
import { AppPrivyProvider } from "../components/providers/PrivyProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>CastQuest Admin</title>
      </head>
      <body className="bg-bg-primary text-white antialiased">
        <AppPrivyProvider>
          {children}
        </AppPrivyProvider>
      </body>
    </html>
  );
}
