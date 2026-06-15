import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  SITE_NAME,
  bySlug,
  buildH1,
  buildMetaDescription,
  buildMetaTitle,
  cityFactsFor,
  cityFromTargetArea,
  cityPagesForPillar,
  faqsFor,
  humanTopic,
  isCityPage,
  linkLabel,
  pageLocation,
  pillarFor,
  sameCityPages,
  supportCityLinks,
  toPath,
} from "@/lib/site-data";
import { cityServiceSchema, faqSchema, pageBreadcrumb } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

export async function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ slug: page.pageSlug.replace(/^\//, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: buildMetaTitle(page),
    description: buildMetaDescription(page),
    alternates: { canonical: toPath(page.pageSlug) },
    keywords: [page.primaryKeyword, ...page.secondaryKeywords.split(",").map((item) => item.trim()).filter(Boolean)],
    openGraph: {
      title: buildMetaTitle(page),
      description: buildMetaDescription(page),
      url: toPath(page.pageSlug),
      type: "article",
      siteName: SITE_NAME,
      locale: "en_CA",
    },
  };
}

function introText(page: NonNullable<ReturnType<typeof bySlug>>) {
  const location = pageLocation(page);
  const topic = humanTopic(page).toLowerCase();
  const facts = cityFactsFor(page);
  if (isCityPage(page) && facts) {
    return `${location} service calls often start with the local setting: homes near ${facts.landmarks[0]}, parks and older housing around ${facts.neighborhoods[0]}, and utility rooms affected by ${facts.climate}. For ${topic}, the first conversation should identify the structure type, shutoff access, visible moisture, flooring condition, and whether the home is occupied, rented, or parked seasonally. That detail helps the response plan stay practical before anyone opens a wall, removes skirting, or disturbs wet material.`;
  }
  return `${topic} calls can involve a compact utility chase, underbelly insulation, a narrow RV cabinet, an older shutoff, or water that has moved farther than expected before it becomes visible. This page gives the service path a clear starting point: what to describe on the phone, what a technician checks first, and how repair, drying, replacement, or documentation decisions are usually sorted. The goal is a calm next step when the property feels uncertain.`;
}

function planningText(page: NonNullable<ReturnType<typeof bySlug>>) {
  const topic = humanTopic(page).toLowerCase();
  const location = pageLocation(page);
  const facts = cityFactsFor(page);
  if (isCityPage(page) && facts) {
    return `In ${location}, crews may be working around ${facts.landmarks[1]}, routes near ${facts.neighborhoods[1]}, or sites shaped by ${facts.climate}. Those conditions matter because water can freeze, wick, pool, or hide differently depending on access and season. A useful service plan separates immediate control from repair decisions, then keeps notes clear enough for owners, park managers, insurers, or tenants who need to understand what happened.`;
  }
  return `For ${topic}, the useful plan is not a generic checklist. It starts with risk level, then moves through access, isolation, testing, repair scope, and follow-up. The same call may involve plumbing work, moisture checks, cabinet removal, flooring review, or a recommendation to stop using a fixture until the wet area is opened safely.`;
}

function processSteps(page: NonNullable<ReturnType<typeof bySlug>>) {
  const location = pageLocation(page);
  return [
    {
      title: "Call Intake",
      text: `Share the home type, visible symptom, access restrictions, and whether water is still active. The dispatcher records the ${location} context and urgency before routing the request.`,
    },
    {
      title: "Access Review",
      text: "The technician checks skirting, cabinets, crawl areas, valves, underbelly material, fixtures, or RV compartments before deciding which area should be opened or tested.",
    },
    {
      title: "Repair Path",
      text: "Work is prioritized by safety and damage control first, then long-term reliability. Small leaks, damaged pipe sections, frozen lines, and saturated materials are separated into clear tasks.",
    },
    {
      title: "Closeout Notes",
      text: "You receive plain-language findings, completed actions, and recommended monitoring so the next decision is easier for owners, tenants, park managers, or insurance contacts.",
    },
  ];
}

function PageLinks({ page }: { page: NonNullable<ReturnType<typeof bySlug>> }) {
  const pillar = pillarFor(page);
  const cityLinks = cityPagesForPillar(page);
  const siblingLinks = sameCityPages(page);
  const supportLinks = supportCityLinks(page, 5);

  if (page.pageType === "Service Pillar") {
    const links = cityLinks.length ? cityLinks : supportLinks;
    return (
      <section className="rescue-detail">
        <h2>City Pages For This Service</h2>
        <p>
          Use these local routes when the same issue needs city-specific timing, weather context, or access planning.
          Each link keeps the service focus clear while moving into a local page.
        </p>
        <div className="rescue-grid rescue-grid-4">
          {links.map((item) => (
            <Link className="rescue-chip" key={item.pageSlug} href={toPath(item.pageSlug)}>
              {linkLabel(item)}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (isCityPage(page)) {
    return (
      <section className="rescue-detail">
        <h2>Related Local Routes</h2>
        <div className="rescue-link-panels">
          <Link className="rescue-card rescue-card-link" href={toPath(pillar.pageSlug)}>
            <span>Parent service</span>
            <h3>{linkLabel(pillar)}</h3>
            <p>Use the pillar page for the broader service path, common causes, and non-city-specific repair planning.</p>
          </Link>
          {siblingLinks.slice(0, 5).map((item) => (
            <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
              <span>Same city</span>
              <h3>{linkLabel(item)}</h3>
              <p>Compare another service route in {cityFromTargetArea(item.targetArea)} without leaving the local context.</p>
            </Link>
          ))}
          {siblingLinks.length === 0 &&
            supportLinks.slice(0, 2).map((item) => (
              <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
                <span>Nearby service map</span>
                <h3>{linkLabel(item)}</h3>
                <p>Use this related city route when the local page is the only page currently mapped for this city.</p>
              </Link>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rescue-detail">
      <h2>Relevant Service And City Pages</h2>
      <div className="rescue-link-panels">
        <Link className="rescue-card rescue-card-link" href={toPath(pillar.pageSlug)}>
          <span>Recommended pillar</span>
          <h3>{linkLabel(pillar)}</h3>
          <p>Open the main service route for the full repair pathway behind this question.</p>
        </Link>
        {supportLinks.slice(0, 5).map((item) => (
          <Link className="rescue-card rescue-card-link" key={item.pageSlug} href={toPath(item.pageSlug)}>
            <span>City route</span>
            <h3>{linkLabel(item)}</h3>
            <p>Review a local version of the service path with city-specific context.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function DynamicSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) notFound();

  const faqs = faqsFor(page);
  const serviceSchema = cityServiceSchema(page);
  const schema = serviceSchema ? [pageBreadcrumb(page), faqSchema(page), ...serviceSchema] : [pageBreadcrumb(page), faqSchema(page)];
  const facts = cityFactsFor(page);

  return (
    <main className="rescue-main rescue-page">
      <JsonLd data={schema} />
      <section className="rescue-wrap rescue-page-head">
        <p className="rescue-kicker">{page.pageType}</p>
        <h1>{buildH1(page)}</h1>
        <p>{introText(page)}</p>
        <div className="rescue-actions">
          <a className="rescue-call rescue-call-large" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
          <Link className="rescue-secondary rescue-secondary-dark" href="/services">
            Browse All Services
          </Link>
        </div>
      </section>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap rescue-split">
          <div>
            <p className="rescue-kicker">Service planning</p>
            <h2>What The First Visit Needs To Resolve</h2>
          </div>
          <p>{planningText(page)}</p>
        </div>
      </section>

      {facts && (
        <section className="rescue-section">
          <div className="rescue-wrap">
            <h2>{pageLocation(page)} Location Notes</h2>
            <div className="rescue-grid rescue-grid-3">
              <article className="rescue-card">
                <h3>Neighborhood Access</h3>
                <p>
                  Service planning may account for homes and parks around {facts.neighborhoods[0]} and{" "}
                  {facts.neighborhoods[1]}, especially when parking, skirting clearance, or older utility access affects
                  timing.
                </p>
              </article>
              <article className="rescue-card">
                <h3>Nearby Landmarks</h3>
                <p>
                  Calls near {facts.landmarks[0]} or {facts.landmarks[1]} can involve different drainage patterns,
                  travel routes, and seasonal moisture concerns.
                </p>
              </article>
              <article className="rescue-card">
                <h3>Weather Pattern</h3>
                <p>
                  Local conditions include {facts.climate}, which can affect frozen supply lines, slow drying, hidden
                  dampness, or repeated expansion around fittings.
                </p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <h2>How The Work Is Sequenced</h2>
          <div className="rescue-timeline">
            {processSteps(page).map((step, index) => (
              <article className="rescue-step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap rescue-split">
          <div>
            <p className="rescue-kicker">Scope clarity</p>
            <h2>What This Page Helps You Sort Out</h2>
          </div>
          <ul className="rescue-checks">
            <li>Whether the immediate priority is stopping water, restoring plumbing, or protecting wet materials.</li>
            <li>Which access points matter before panels, skirting, belly wrap, cabinets, or flooring are disturbed.</li>
            <li>How to describe the issue clearly during phone intake so the visit starts with useful information.</li>
            <li>When repair notes, photos, moisture observations, or insurance documentation may be useful.</li>
            <li>Which related service page is the best next step if the symptom changes after inspection.</li>
          </ul>
        </div>
      </section>

      <div className="rescue-wrap">
        <PageLinks page={page} />
      </div>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <h2>Common Questions</h2>
          <div className="rescue-grid rescue-grid-3">
            {faqs.map((faq) => (
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
