import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og-shop.png`;

  return {
    title: "RankRush Shop — BedWars Ranked Carries",
    description: "Shop Roblox BedWars ranked carry packages with clear prices, express options, and online teammates.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "RankRush Shop — Ranked Carries",
      description: "Shop BedWars ranked carry packages from $4.99.",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "RankRush ranked carry shop" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "RankRush Shop — Ranked Carries",
      description: "Shop BedWars ranked carry packages from $4.99.",
      images: [imageUrl],
    },
  };
}

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
        {children}
      </body>
    </html>
  );
}
