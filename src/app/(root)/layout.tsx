import type { Metadata } from "next";
import { ReactNode } from 'react';
import { inter } from '@/assets/fonts';
import "../globals.css";

export const metadata: Metadata = {
  title: "Thread",
  description: "The App for Communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
