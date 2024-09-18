import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Inter } from 'next/font/google';
import './globals.css';

// Import Inter from Google Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Branch Book App',
  description: 'Hello',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
