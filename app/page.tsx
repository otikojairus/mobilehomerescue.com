import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { IconMark } from "@/components/icon-mark";
import {
  CITY_PAGES,
  EMERGENCY_PAGES,
  NEAR_ME_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  PILLAR_PAGES,
  SITE_NAME,
  SITE_TAGLINE,
  SYMPTOM_PAGES,
  absoluteUrl,
  pageListLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "What kinds of pages does this site organize?",
    a: "The site is built around septic, sump pump, emergency, symptom, and cost pages so a visitor can move from a broad problem to the most relevant help without digging through unrelated plumbing language.",
  },
  {
    q: "Why does the site use separate city pages?",
    a: "City pages keep local access, weather, and neighbourhood details visible. That makes the page feel like it belongs to the place the customer is searching from instead of reading like a generic regional listing.",
  },
  {
    q: "Can I jump straight to a phone call?",
    a: `Yes. Every major page includes a tap-to-call link at the top. If you already know the issue, use ${PHONE_DISPLAY} and the team can move the conversation toward the right service path quickly.`,
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} | Septic and Sump Pump Help`,
  description: SITE_TAGLINE,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Septic and Sump Pump Help`,
    description: SITE_TAGLINE,
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function HomePage() {
  return (
    <main className="page-shell home-shell">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <section className="page-hero home-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Canada-wide septic and sump pump help</p>
          <h1>Better paths for septic and sump pump help</h1>
          <p className="lede">
            This site is organized for people who want a fast, clear answer without wading through a generic plumbing
            listing. Septic systems, sump pumps, emergency problems, and city-specific pages each get their own
            place so the words stay focused, the phone action stays obvious, and the local context stays easy to read.
            If a property is wet, backing up, making noise, or overdue for service, the next step should feel simple
            rather than overwhelming.
          </p>
          <div className="cta-row">
            <a className="cta-button" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <Link className="cta-button secondary" href="/services">
              See all services
            </Link>
          </div>
        </div>

        <aside className="hero-aside hero-aside-home">
          <div className="visual-panel">
            <Image src="/hero-scene.svg" alt="Stylized septic and sump pump illustration" width={960} height={720} priority className="visual-image" />
          </div>
          <div className="mini-grid mini-grid-alt">
            <div className="mini-card mini-card-accent">
              <IconMark name="drop" />
              <span>{PILLAR_PAGES.length}</span>
              <p>Main service pages</p>
            </div>
            <div className="mini-card mini-card-accent">
              <IconMark name="map" />
              <span>{CITY_PAGES.length}</span>
              <p>City-specific help</p>
            </div>
            <div className="mini-card mini-card-accent">
              <IconMark name="bolt" />
              <span>{EMERGENCY_PAGES.length + SYMPTOM_PAGES.length + NEAR_ME_PAGES.length}</span>
              <p>Fast-response pages</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Main services</p>
          <h2>Start with the service that fits the problem</h2>
        </div>
        <div className="card-grid card-grid-3">
          {PILLAR_PAGES.map((page) => (
            <Link key={page.pageSlug} href={toPath(page.pageSlug)} className="surface-card surface-card-link">
              <span>{page.pageType}</span>
              <strong>{pageListLabel(page)}</strong>
              <p>{page.primaryKeyword}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section panel">
        <div className="section-heading">
          <p className="eyebrow">Fast help</p>
          <h2>Fast answers for problems that can’t wait</h2>
        </div>
        <div className="chip-row">
          {[...EMERGENCY_PAGES, ...SYMPTOM_PAGES, ...NEAR_ME_PAGES].map((page) => (
            <Link key={page.pageSlug} className="chip-link" href={toPath(page.pageSlug)}>
              {pageListLabel(page)}
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section light-panel">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">What to expect</p>
          <h2>Short answers, clear priorities, and a visible phone number</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <IconMark name="shield" />
            <h3>Practical first steps</h3>
            <p>If water is active, the site explains how to slow things down and what the first visit should check.</p>
          </article>
          <article className="feature-card">
            <IconMark name="map" />
            <h3>Local details</h3>
            <p>City pages keep neighbourhood, landmark, and weather context visible so the advice feels specific.</p>
          </article>
          <article className="feature-card">
            <IconMark name="phone" />
            <h3>Tap to call</h3>
            <p>Every major page keeps the call action near the top for visitors who already know they need help.</p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Popular cities</p>
          <h2>Local help with the right neighbourhood context</h2>
        </div>
        <div className="card-grid card-grid-4">
          {CITY_PAGES.slice(0, 24).map((page) => (
            <Link key={page.pageSlug} href={toPath(page.pageSlug)} className="surface-card surface-card-link">
              <span>{page.targetArea}</span>
              <strong>{pageListLabel(page)}</strong>
              <p>Local help with neighbourhood, landmark, and climate context.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section panel">
        <div className="section-heading">
          <p className="eyebrow">Why it helps</p>
          <h2>A cleaner way to find the right service</h2>
        </div>
        <div className="copy-grid">
          <article className="copy-card">
            <h3>Easy to read</h3>
            <p>
              The design uses a darker industrial palette, a serif display face, and layered cards so the site feels
              calm, polished, and easy to scan on mobile.
            </p>
          </article>
          <article className="copy-card">
            <h3>Less guesswork</h3>
            <p>
              Each page answers a slightly different customer question, so the wording changes with the service and the
              city instead of repeating the same block over and over.
            </p>
          </article>
          <article className="copy-card">
            <h3>Simple next steps</h3>
            <p>
              Every page points somewhere useful, whether that is a broader service, a nearby city, or a faster help
              option when the situation feels urgent.
            </p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Common questions</p>
          <h2>Quick answers for first-time visitors</h2>
        </div>
        <div className="faq-grid">
          {homeFaqs.map((faq) => (
            <article className="faq-card" key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
