import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CastQuest Frames',
  description: 'Farcaster frames for CastQuest market signals and token details',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
