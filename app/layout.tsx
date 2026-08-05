import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const siteUrl = `${protocol}://${host}`;
  const imageUrl = `${siteUrl}/og-shop-v3.png`;

  return {
    title: "Roblox Shop — Game Services",
    description: "Browse Roblox game services, starting with BedWars ranked carries.",
    icons: { icon: "/roblox-shop-logo-v2.png", shortcut: "/roblox-shop-logo-v2.png" },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "Roblox Shop",
      title: "Roblox Shop — Game Services",
      description: "Browse Roblox game shops and choose the service you need.",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Roblox Shop game selector" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Roblox Shop — Game Services",
      description: "Browse Roblox game shops and choose the service you need.",
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
