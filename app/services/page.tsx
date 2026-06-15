import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { CITY_PAGES, SEO_PAGES, SERVICE_PILLARS, SUPPORT_PAGES, SITE_NAME, absoluteUrl, linkLabel, toPath } from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const serviceFaqs = [
  {
    q: "How should I choose between a service hub and a city page?",
    a: "Start with a service hub when you want the broad repair pathway. Use a city page when you already know the location and want local routing, regional weather context, and links to other services in the same area.",
  },
  {
    q: "Are emergency pages different from standard service pages?",
    a: "Yes. Emergency pages emphasize immediate call intake, leak control, damage limitation, and triage. Standard hubs provide more background on inspection steps, repair choices, prevention, and related city coverage.",
  },
  {
    q: "Does this index include every generated page?",
    a: "Yes. Every service, city, emergency, symptom, and cost page is linked from this index. That keeps navigation clear for visitors and gives search engines a simple path to crawl the full site.",
  },
];

export const metadata: Metadata = {
  title: "Mobile Home Plumbing Services | Mobile Home Rescue",
  description:
    "Browse mobile home plumbing, RV plumber, emergency plumber, water damage, burst pipe, city, symptom, and cost pages. Call now for direct repair intake.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${SITE_NAME} Service Index`,
    description: "Complete service and city index for mobile home, RV, and water damage response pages.",
    url: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <main className="rescue-main rescue-page">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: serviceFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />
      <section className="rescue-wrap rescue-page-head">
        <p className="rescue-kicker">Complete crawl index</p>
        <h1>Mobile Home Plumbing Services Canada</h1>
        <p>
          This index collects every service, city, emergency, symptom, and cost route on the site. It is meant for
          callers who need a fast path from problem to phone intake, and for property owners comparing whether their
          issue belongs under mobile-home repair, RV plumbing, burst-pipe service, or water damage restoration. Each
          page has its own wording, FAQ set, canonical URL, and internal links back into the broader service map.
        </p>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <h2>Service Pillars</h2>
          <div className="rescue-grid rescue-grid-3">
            {SERVICE_PILLARS.map((page) => (
              <Link className="rescue-card rescue-card-link" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <span>{page.priority}</span>
                <h3>{page.pageTitle.replace(/\s*\|.*/, "")}</h3>
                <p>{page.searchIntent} page for {page.targetArea.toLowerCase()}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <h2>City Service Pages</h2>
          <div className="rescue-grid rescue-grid-4">
            {CITY_PAGES.map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <h2>Emergency, Symptom and Cost Pages</h2>
          <div className="rescue-grid rescue-grid-4">
            {SUPPORT_PAGES.map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <h2>All Pages</h2>
          <div className="rescue-index-list">
            {SEO_PAGES.map((page) => (
              <Link href={toPath(page.pageSlug)} key={page.pageSlug}>
                {page.pageTitle}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <h2>Common Questions</h2>
          <div className="rescue-grid rescue-grid-3">
            {serviceFaqs.map((faq) => (
              <article className="rescue-card" key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
