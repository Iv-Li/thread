import type { Metadata } from "next";
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { inter } from '@/assets/fonts';
import "../globals.css";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "Thread auth",
  description: "Auth page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} text-bg-reverse-1 bg-bg-1`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
