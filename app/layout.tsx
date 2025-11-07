import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YeetHub | Wrap & Monetize APIs with x402",
  description:
    "Wrap any API with x402 pay-per-request billing, auto-assigned subdomains, and Solana payments.",
  openGraph: {
    title: "YeetHub | Wrap & Monetize APIs with x402",
    description:
      "Transform your API into a monetized service with x402 payments, analytics, and automatic subdomains.",
    url: "https://yeethub.io",
    siteName: "YeetHub",
    type: "website",
    images: [
      {
        url: "https://yeethub.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "YeetHub API monetization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YeetHub | Wrap & Monetize APIs with x402",
    description:
      "Add x402 pay-per-request billing, analytics, and automatic subdomains to any API in minutes.",
    images: ["https://yeethub.io/og-image.png"],
  },
  metadataBase: new URL("https://yeethub.io"),
  keywords: [
    "YeetHub",
    "x402",
    "API monetization",
    "Solana",
    "pay per request",
    "API wrapper",
  ],
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
