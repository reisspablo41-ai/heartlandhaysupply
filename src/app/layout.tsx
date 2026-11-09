import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { STORE_NAME, SITE_URL } from "@/lib/env";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} — Premium hay, straw & forage`,
    template: `%s · ${STORE_NAME}`,
  },
  description:
    "Field-cured timothy, orchard grass, bermuda and straw. Moisture tested, stored under cover and shipped direct from the barn.",
  openGraph: {
    type: "website",
    siteName: STORE_NAME,
    title: `${STORE_NAME} — Premium hay, straw & forage`,
    description:
      "Field-cured timothy, orchard grass, bermuda and straw, shipped direct from the barn.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
