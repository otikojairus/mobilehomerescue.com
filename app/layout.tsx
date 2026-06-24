import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Mobile Home, RV and Water Damage Help`,
    template: "%s",
  },
  description:
    "Canada-wide mobile home plumbing, RV plumbing, emergency plumber, burst pipe, and water damage response pages with direct call support.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Mobile Home, RV and Water Damage Help`,
    description: "Call-only plumbing and water damage response pages for manufactured homes, trailers, and RVs.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${jakarta.variable} ${lora.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: '(function(){var a=document.createElement("script");a.type="text/javascript";a.async=!0;a.defer=!0;a.src=document.location.protocol+"//dist.routingapi.com/jsapi/v1/retreaver.min.js";a.onload=a.onreadystatechange=function(){Retreaver.configure({host:"api.routingapi.com",prefix:"https:"==document.location.protocol?"https":"http"});(new Retreaver.Campaign({campaign_key:"ff97b1af347572af5363ff0efe41842d"})).auto_replace_numbers()};(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(a)})();',
          }}
        />
      </head>
      <body>
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
