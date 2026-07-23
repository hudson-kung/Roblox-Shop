import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og-shop.png`;

  return {
    title: "BedWars Shop — Ranked Carries",
    description: "Configure a Roblox BedWars ranked carry with clear pricing and online teammates.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "BedWars Shop — Ranked Carries",
      description: "Choose your current and target rank for an instant carry quote.",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "BedWars Shop ranked carry configurator" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "BedWars Shop — Ranked Carries",
      description: "Choose your current and target rank for an instant carry quote.",
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
      <body>{children}</body>
    </html>
  );
}
