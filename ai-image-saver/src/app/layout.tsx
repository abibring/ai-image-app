import type { Metadata } from "next";

import "./globals.css";

import { Providers } from "./Providers";

import { geistMono, geistSans } from "./font";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description:
    "Generates images using AI based on prompts. Allows users to generate, save, and view images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
