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

import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased w-screen h-dvh flex items-center justify-center bg-gray-200 sm:py-4`} suppressHydrationWarning={true}>
        <main className='max-w-md w-full h-full bg-white sm:rounded-3xl overflow-auto relative'>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
