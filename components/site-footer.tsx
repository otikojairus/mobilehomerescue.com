import Link from "next/link";
import Image from "next/image";
import {
  CITY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  PILLAR_PAGES,
  SITE_NAME,
  pageListLabel,
  shortPageTitle,
  toPath,
} from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <section>
          <div className="site-footer-brand">
            <Image src="/logo.svg" alt="Sump & Septic Co. logo" width={38} height={38} />
            <div>
              <p>{SITE_NAME}</p>
              <span>Practical help when the water won’t wait</span>
            </div>
          </div>
          <p className="site-footer-copy">
            Friendly, direct support for septic systems, sump pumps, and drainage issues that need attention fast.
          </p>
          <a className="site-call site-footer-call" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
        </section>

        <section>
          <h2>Service pages</h2>
          <nav className="site-footer-links" aria-label="Footer pillar pages">
            {PILLAR_PAGES.slice(0, 6).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {shortPageTitle(page)}
              </Link>
            ))}
          </nav>
        </section>

        <section>
          <h2>Quick help</h2>
          <nav className="site-footer-links" aria-label="Footer quick pages">
            {[
              ...PILLAR_PAGES.slice(6, 10),
              ...CITY_PAGES.slice(0, 8),
            ].map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {page.pageType === "City Service" ? pageListLabel(page).split(" • ")[0] : shortPageTitle(page)}
              </Link>
            ))}
          </nav>
        </section>

        <section>
          <h2>Popular cities</h2>
          <nav className="site-footer-links site-footer-cities" aria-label="Footer city pages">
            {CITY_PAGES.slice(0, 12).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)} aria-label={pageListLabel(page)}>
                {pageListLabel(page).split(" • ")[0]}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </footer>
  );
}
