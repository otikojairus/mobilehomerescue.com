import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, SITE_TAGLINE, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Septic and Sump Pump Help`,
    template: "%s",
  },
  description: SITE_TAGLINE,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Septic and Sump Pump Help`,
    description: SITE_TAGLINE,
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Septic and Sump Pump Help`,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

