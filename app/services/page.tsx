import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { IconMark } from "@/components/icon-mark";
import {
  CITY_PAGES,
  COST_PAGES,
  EMERGENCY_PAGES,
  NEAR_ME_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  PILLAR_PAGES,
  SITE_NAME,
  SYMPTOM_PAGES,
  SeoPage,
  absoluteUrl,
  pageListLabel,
  serviceFamilyFor,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const groupedCityPills = {
  septic: CITY_PAGES.filter((page) => serviceFamilyFor(page).startsWith("/septic")),
  sump: CITY_PAGES.filter((page) => serviceFamilyFor(page).startsWith("/sump")),
};

export const metadata: Metadata = {
  title: `Services | ${SITE_NAME}`,
  description: "Browse septic, sump pump, emergency, symptom, and city help pages with direct call access.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Services | ${SITE_NAME}`,
    description: "Browse septic, sump pump, emergency, symptom, and city help pages with direct call access.",
    url: absoluteUrl("/services"),
    type: "website",
    siteName: SITE_NAME,
  },
};

function serviceGroup(title: string, description: string, pages: ReadonlyArray<SeoPage>) {
  return (
    <section className="page-section panel" key={title}>
      <div className="section-heading">
        <p className="eyebrow">{title}</p>
        <h2>{description}</h2>
      </div>
      <div className="link-grid">
        {pages.map((page) => (
          <Link key={page.pageSlug} href={toPath(page.pageSlug)} className="link-card">
            <span>{page.pageType}</span>
            <strong>{pageListLabel(page)}</strong>
            <p>{page.primaryKeyword}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="page-shell service-shell">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />

      <section className="page-hero page-hero-detail">
        <div className="page-hero-copy">
          <p className="eyebrow">Service pages</p>
          <h1>Everything organized by the job you need</h1>
          <p className="lede">
            Use this page to jump to the kind of help that matches your problem. If you need septic pumping, a sump
            pump fix, help with an alarm, or a city-specific service page, the options below make it easy to get there
            without guesswork. Each section is written for real customers who want a quick answer and a clear call to
            action.
          </p>
          <div className="cta-row">
            <a className="cta-button" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <Link className="cta-button secondary" href="/">
              Back to home
            </Link>
          </div>
        </div>

        <aside className="hero-aside">
          <div className="stat-card">
            <span>Helpful pages</span>
            <strong>{PILLAR_PAGES.length + CITY_PAGES.length + EMERGENCY_PAGES.length + SYMPTOM_PAGES.length + COST_PAGES.length + NEAR_ME_PAGES.length}</strong>
            <p>Find the right service, then use the phone button whenever you are ready.</p>
          </div>
        </aside>
      </section>

      <section className="page-section light-panel">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Before you call</p>
          <h2>Three things that help us help you faster</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <IconMark name="drop" />
            <h3>What is happening?</h3>
            <p>Tell us whether it is a leak, alarm, backup, odor, or an overdue pump-out.</p>
          </article>
          <article className="feature-card">
            <IconMark name="map" />
            <h3>Where is the property?</h3>
            <p>A city and neighbourhood help us point you to the page that matches the local conditions.</p>
          </article>
          <article className="feature-card">
            <IconMark name="phone" />
            <h3>How soon do you need help?</h3>
            <p>Some situations can wait for scheduled service, while others need a faster response.</p>
          </article>
        </div>
      </section>

      {serviceGroup("Need help fast?", "Emergency, symptom, cost, and nearby help pages", [
        ...EMERGENCY_PAGES,
        ...SYMPTOM_PAGES,
        ...COST_PAGES,
        ...NEAR_ME_PAGES,
      ])}

      {serviceGroup("Septic help", "Septic services and repair pages", PILLAR_PAGES.filter((page) => page.pageSlug.startsWith("/septic")))}

      {serviceGroup("Sump pump help", "Sump pump services and repair pages", PILLAR_PAGES.filter((page) => page.pageSlug.startsWith("/sump")))}

      {serviceGroup("Septic cities", "Septic help by city", groupedCityPills.septic)}

      {serviceGroup("Sump pump cities", "Sump pump help by city", groupedCityPills.sump)}
    </main>
  );
}
