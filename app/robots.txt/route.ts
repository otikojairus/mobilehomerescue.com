import { getSiteUrl } from "@/lib/site-data";

export const revalidate = 3600;

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${getSiteUrl()}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
