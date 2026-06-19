import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  SEO_PAGES,
  SITE_NAME,
  buildH1,
  buildMetaDescription,
  buildMetaTitle,
  bySlug,
  cityFactsFor,
  isCityPage,
  pageFamilyPages,
  pageListLabel,
  pageLocation,
  pillarFor,
  relatedCityLinks,
  sameCityPages,
  shortPageTitle,
  serviceFamilyFor,
  serviceTopicLabel,
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

function pageKindLead(pageType: string) {
  switch (pageType) {
    case "Service Pillar":
      return "service overview";
    case "City Service":
      return "local service page";
    case "Emergency":
      return "urgent help page";
    case "Near Me":
      return "nearby help page";
    case "Symptom":
      return "symptom guide";
    case "Cost Guide":
      return "cost guide";
    default:
      return "service page";
  }
}

function introCopy(page: NonNullable<ReturnType<typeof bySlug>>) {
  const city = pageLocation(page);
  const facts = cityFactsFor(page);
  const topic = serviceTopicLabel(page);
  const kind = pageKindLead(page.pageType);
  const family = serviceFamilyFor(page);

  if (isCityPage(page)) {
    return [
      `${topic} in ${city} needs a local read on access, weather, and the way the property sits on the lot. Around ${facts.neighborhoods[0]} and ${facts.neighborhoods[1]}, crews may be working with older utility runs, tighter driveways, or a service area that is easier to reach from one side of the home than the other. The first phone conversation should be simple, practical, and built around the system, not around a generic checklist.`,
      `That is why this page keeps the focus on the ${city} context. The local climate, the pace of spring melt or summer heat, and the nearby landmarks around ${facts.landmarks[0]} all change how quickly a tank can be accessed, how wet the ground may be, and how much room there is to stage equipment. The goal is to help a homeowner, landlord, or property manager move from uncertainty to a concrete next step without repeating the same information twice.`,
    ].join(" ");
  }

  if (page.pageType === "Service Pillar") {
    return [
      `This ${kind} is the broad starting point for families of work that often overlap. A septic or sump issue can begin as one complaint, then turn into inspection, cleaning, repair, replacement, or follow-up once the access point is opened and the real cause is visible. The pages in this section are written to keep that decision tree clear before anyone spends time digging, resetting, or opening the wrong component.`,
      `For ${shortPageTitle(page)}, the useful question is not only what failed, but how the system should be handled from the first call through the final handoff. Some jobs need a simple pump-out and a check of the baffles, some need a replacement component, and some need a stronger plan because the site is flooded, clogged, or has a history of repeated service calls. The copy here is designed to keep the next step readable and the phone action obvious.`,
    ].join(" ");
  }

  if (page.pageType === "Emergency") {
    return [
      `When water is active, the first minute matters more than the perfect explanation. This ${kind} keeps the priority on stop-the-water steps, site access, and whether the problem is still moving through the home, yard, or mechanical area. The page gives callers a calm way to reach the right help before the issue spreads into flooring, insulation, or a buried line that becomes harder to reach.`,
      `The related service pages and nearby city pages help narrow the next move once the first facts are clear. If the problem sits with a septic system, the call should move one way; if it sits with a sump pump, backup discharge, or a failed check valve, the best next step changes. That is the kind of split this page is meant to clarify.`,
    ].join(" ");
  }

  if (page.pageType === "Symptom") {
    return [
      `A symptom page should do more than repeat the symptom. It should help a reader decide whether the issue is a reset, a maintenance problem, or a deeper failure that needs hands-on service. That is the role of this ${kind}: it turns a visible clue into a clearer set of next steps without overpromising a one-size-fits-all fix.`,
      `For a ${topic.toLowerCase()} concern, the practical questions are about noise, alarms, cycling, backup discharge, wet soil, odor, or how long the issue has been happening. A local visit can confirm whether the problem is small and contained or whether the system needs cleanup and repair before damage grows.`,
    ].join(" ");
  }

  if (page.pageType === "Cost Guide") {
    return [
      `Cost questions are easier to answer when the page explains what actually changes the price. A septic or sump job can shift based on access, depth, clean-up needs, pump size, parts availability, and whether the issue is a quick fix or a larger replacement. This ${kind} gives the reader a grounded way to think about that range before calling.`,
      `The point is not to hide the estimate behind vague language. It is to explain why one property is simple and another takes more time, more equipment, or more attention to follow-up. When the job is visible, the price conversation becomes more useful and less stressful.`,
    ].join(" ");
  }

  return [
    `If someone is searching for ${topic.toLowerCase()} help, they are usually trying to narrow a moving problem into one clear next step. This ${kind} keeps that next step visible by describing the likely checks, the access points that matter, and the service that best fits the issue. The page is intentionally plainspoken so it feels like help, not a template.`,
    `The surrounding pages for ${family} and the related city pages make it easier to compare options without starting over. That keeps the next step short and the call-to-action direct.`,
  ].join(" ");
}

function supportCopy(page: NonNullable<ReturnType<typeof bySlug>>) {
  const city = pageLocation(page);
  const facts = cityFactsFor(page);
  const topic = serviceTopicLabel(page);
  if (isCityPage(page)) {
    return [
      `In ${city}, the best service plan starts with the property itself: where the driveway sits, whether the tank or pump is closer to the road or the rear of the lot, and how much room there is beside the home or in the yard. Near ${facts.landmarks[1]}, the weather and ground conditions can change how fast the site dries, how the truck stages, and whether a simple repair is enough.`,
      `The local population and neighbourhood structure also matter. With about ${facts.population}, ${city} has a mix of older areas, newer subdivisions, and infill lots, which means no two access paths are quite the same. A practical visit should explain whether the issue is service, cleaning, repair, or replacement and should leave the next move easy to understand.`,
      `If the issue crosses into another service line, the links below make that handoff simple. A reader can move back to the main service page, compare another service in the same city, or review another local option without losing the context that brought them here.`,
    ].join(" ");
  }

  if (page.pageType === "Service Pillar") {
    return [
      `This section works as an anchor for everything around ${topic.toLowerCase()}. Some callers already know the symptom and need the right service page. Others only know the system is backing up, cycling too much, or leaving water where it should not be. The page gives both audiences a steady starting point.`,
      `Once the broad service choice is made, the work can branch into cleaner tasks: inspection, cleaning, repair, replacement, or response to a specific problem such as a failed pump, clogged line, or damaged component. That branching is what keeps the site useful for real customers instead of only matching a keyword list.`,
      `The linked city pages below add the local layer. They keep the service name consistent while changing the access and weather context so the page feels more concrete.`,
    ].join(" ");
  }

  if (page.pageType === "Emergency") {
    return [
      `Emergency pages work best when the first paragraph tells the reader what to do before the details matter. Shut off the active source if possible, keep people away from wet flooring or soft ground, and move to the page that matches the system type. That simple pattern protects the site and keeps the next call focused.`,
      `From there, the linked service pages show the broader help options while the city pages add local access and climate context. That combination helps the visitor decide whether they need response, repair, or a stronger cleanup plan.`,
      `It also keeps the page from feeling vague. The content speaks directly to the task, the system, and the urgency without collapsing into a generic emergency message.`,
    ].join(" ");
  }

  if (page.pageType === "Near Me") {
    return [
      `When someone searches close by, they want a company that can respond, understands the system type, and does not need a long explanation to get started. The copy should keep the local option visible while still showing which service page handles the actual work.`,
      `That is why the supporting links below point to the main service and a handful of nearby cities. It gives searchers a realistic set of next options instead of one oversized, catch-all page.`,
      `The page still stands on its own, but it benefits from a short path into the broader service area.`,
    ].join(" ");
  }

  if (page.pageType === "Symptom") {
    return [
      `A symptom is useful because it narrows the problem, but it does not solve the problem by itself. That is why the page explains the likely service families, the reasons the symptom can appear, and the kinds of access checks that usually happen on site.`,
      `For ${topic.toLowerCase()}, the user may be dealing with a one-time glitch, a maintenance warning, or a deeper repair need. The page is designed to separate those possibilities without sounding mechanical.`,
      `The related links move the reader into the main service page and the relevant cities so the path stays practical.`,
    ].join(" ");
  }

  return [
      `Price-sensitive visitors need a page that explains what drives the range without forcing them through a sales pitch. This section lays out the factors that tend to change the scope: equipment size, access, cleanup, and whether the call ends with maintenance or replacement.`,
      `Once those pieces are visible, the related pages make more sense. A person can see the main service, compare the local option, and then decide how much urgency the situation has.`,
      `The copy stays customer-facing and avoids sounding like a form or spreadsheet.`,
    ].join(" ");
}

function relatedLinks(page: NonNullable<ReturnType<typeof bySlug>>) {
  const familyPages = pageFamilyPages(page);
  const primaryPillar = pillarFor(page);
  const cityLinks = isCityPage(page) ? sameCityPages(page) : relatedCityLinks(page, 5);
  const links = new Map<string, NonNullable<ReturnType<typeof bySlug>>>();
  [primaryPillar, ...familyPages, ...cityLinks].forEach((item) => {
    if (item) links.set(item.pageSlug, item);
  });
  return [...links.values()].slice(0, 8);
}

function heroEyebrow(page: NonNullable<ReturnType<typeof bySlug>>) {
  switch (page.pageType) {
    case "Service Pillar":
      return "Core service";
    case "City Service":
      return "Local page";
    case "Emergency":
      return "Urgent help";
    case "Near Me":
      return "Close by";
    case "Symptom":
      return "Symptom guide";
    case "Cost Guide":
      return "Cost notes";
    default:
      return "Service page";
  }
}

export default async function DynamicSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = bySlug(slug);
  if (!page) notFound();

  const faqs = faqSchema(page);
  const citySchema = cityServiceSchema(page);
  const schema = citySchema
    ? [pageBreadcrumb(page), faqs, ...citySchema]
    : [pageBreadcrumb(page), faqs];
  const related = relatedLinks(page);
  const facts = isCityPage(page) ? cityFactsFor(page) : null;

  return (
    <main className="page-shell page-detail">
      <JsonLd data={schema} />

      <section className="page-hero page-hero-detail">
        <div className="page-hero-copy">
          <p className="eyebrow">{heroEyebrow(page)}</p>
          <h1>{buildH1(page)}</h1>
          <p className="lede">{introCopy(page)}</p>
          <div className="cta-row">
            <a className="cta-button" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <Link className="cta-button secondary" href="/services">
              Browse all help pages
            </Link>
          </div>
        </div>

        <aside className="hero-aside">
          <div className="stat-card">
            <span>{page.pageType}</span>
            <strong>{shortPageTitle(page)}</strong>
            <p>{page.primaryKeyword}</p>
          </div>
          {facts ? (
            <div className="stat-stack">
              <div className="stat-card subtle">
                <span>Neighbourhoods</span>
                <strong>{facts.neighborhoods.join(" and ")}</strong>
              </div>
              <div className="stat-card subtle">
                <span>Landmarks</span>
                <strong>{facts.landmarks.join(" and ")}</strong>
              </div>
              <div className="stat-card subtle">
                <span>Climate</span>
                <strong>{facts.climate}</strong>
              </div>
            </div>
          ) : (
            <div className="stat-stack">
              <div className="stat-card subtle">
                <span>Service family</span>
                <strong>{serviceTopicLabel(page)}</strong>
              </div>
              <div className="stat-card subtle">
                <span>Route</span>
                <strong>{pageLocation(page)}</strong>
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">What changes the job</p>
          <h2>{page.pageType === "City Service" ? `Local conditions in ${pageLocation(page)}` : "How the page helps decide the next step"}</h2>
        </div>
        <div className="copy-grid">
          <article className="copy-card">
            <h3>{page.pageType === "Emergency" ? "Immediate priorities" : "Practical context"}</h3>
            <p>{supportCopy(page)}</p>
          </article>
          <article className="copy-card">
            <h3>{page.pageType === "City Service" ? "Location notes" : "How this helps"}</h3>
            <p>
              {page.pageType === "City Service"
                ? `The page keeps the ${pageLocation(page)} location grounded in the local streets and weather rather than only the keyword. That means the copy can talk about real access, real climate, and the kind of lot layout that makes a difference when the job starts.`
                : `The supporting pages keep the next step tight. One link takes a visitor back to the main service page, another points to a related city, and the next step becomes easier to understand before anyone makes the call.`}
            </p>
          </article>
        </div>
      </section>

      <section className="page-section panel">
        <div className="section-heading">
          <p className="eyebrow">More help</p>
          <h2>{page.pageType === "City Service" ? "Back to the main service and nearby city pages" : "Follow the most relevant help page"}</h2>
        </div>
        <div className="link-grid">
          {related.map((item) => (
            <Link key={item.pageSlug} href={toPath(item.pageSlug)} className="link-card">
              <span>{item.pageType}</span>
              <strong>{pageListLabel(item)}</strong>
              <p>{page.pageType === "City Service" ? "Compare another local page or the main service page." : "Open a page that matches the service or location you need."}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Customer questions</p>
          <h2>{page.pageType === "City Service" ? `Questions people ask in ${pageLocation(page)}` : "Questions worth answering before the call"}</h2>
        </div>
        <div className="faq-grid">
          {faqs.mainEntity.map((faq) => (
            <article className="faq-card" key={faq.name}>
              <h3>{faq.name}</h3>
              <p>{(faq.acceptedAnswer as { text: string }).text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
