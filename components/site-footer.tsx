import Link from "next/link";
import Image from "next/image";
import { CITY_PAGES, PHONE_DISPLAY, PHONE_E164, SERVICE_PILLARS, SITE_NAME, SUPPORT_PAGES, toPath } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="rescue-footer">
      <div className="rescue-wrap rescue-footer-grid">
        <div>
          <div className="rescue-footer-brand">
            <Image src="/logo.svg" alt="Mobile Home Rescue logo" width={34} height={34} />
            <p>{SITE_NAME}</p>
          </div>
          <p className="rescue-footer-copy">
            Call-only help for manufactured homes, mobile homes, RVs, trailers, leaks, burst pipes, and water damage
            response across Canada.
          </p>
          <a className="rescue-call rescue-footer-call" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
        <div>
          <h2>Service Hubs</h2>
          <nav className="rescue-footer-links" aria-label="Footer service hubs">
            {SERVICE_PILLARS.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {page.pageTitle.replace(/\s*\|.*/, "")}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Urgent Guides</h2>
          <nav className="rescue-footer-links" aria-label="Footer support pages">
            {SUPPORT_PAGES.slice(0, 7).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {page.pageTitle.replace(/\s*\|.*/, "")}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>City Coverage</h2>
          <nav className="rescue-footer-links rescue-footer-cities" aria-label="Footer city pages">
            {CITY_PAGES.slice(0, 14).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {page.pageTitle.replace(/\s*\|.*/, "")}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
