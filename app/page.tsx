import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  CITY_PAGES,
  PHONE_DISPLAY,
  PHONE_E164,
  SERVICE_PILLARS,
  SITE_NAME,
  SUPPORT_PAGES,
  absoluteUrl,
  linkLabel,
  toPath,
} from "@/lib/site-data";
import { breadcrumbSchema } from "@/lib/schema";

const homeFaqs = [
  {
    q: "What types of properties does Mobile Home Rescue support?",
    a: "The site is organized for manufactured homes, mobile homes, RVs, campers, trailers, and properties dealing with urgent plumbing or water damage concerns. The call intake focuses on access, active water, flooring risk, and the type of structure involved.",
  },
  {
    q: "Can I call if I am not sure which page matches my issue?",
    a: "Yes. Use the phone number for direct intake, then describe the visible symptom, location, and urgency. The dispatcher can help route the request toward plumbing repair, burst pipe response, RV service, or water damage cleanup guidance.",
  },
  {
    q: "Why are there separate pages for cities and service types?",
    a: "Separate pages make it easier to find the closest service context and compare related problems. A mobile home leak in Calgary, an RV floor issue in Vancouver, and a burst pipe concern in Ottawa can require different access planning and timing.",
  },
];

export const metadata: Metadata = {
  title: `${SITE_NAME} | Mobile Home and RV Water Help`,
  description:
    "Mobile home plumbing and RV water damage help across Canada. Call 1-888-609-7298 for direct intake, urgent leak guidance, repairs, and cleanup routing.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Mobile Home and RV Water Help`,
    description: "Canada-wide mobile home, manufactured home, RV, and water damage support pages.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function HomePage() {
  return (
    <main className="rescue-main">
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
      <section className="rescue-hero">
        <Image
          className="rescue-hero-image"
          src="/mobile-home-water-response.webp"
          alt="Technician inspecting mobile home plumbing access after a water leak"
          fill
          priority
          sizes="100vw"
        />
        <div className="rescue-hero-scrim" />
        <div className="rescue-wrap rescue-hero-content">
          <p className="rescue-kicker">Canada-wide response routing</p>
          <h1>{SITE_NAME}</h1>
          <p>
            Mobile homes, manufactured homes, trailers, and RVs handle water differently from standard houses. A small
            leak can move through belly wrap, subfloor seams, cabinet bases, or wall panels before anyone sees it. This
            site brings the urgent paths together in one place so a caller can describe the structure, the water source,
            the visible damage, and the local conditions without hunting through generic plumbing pages first.
          </p>
          <div className="rescue-actions">
            <a className="rescue-call rescue-call-large" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <Link className="rescue-secondary" href="/services">
              View Service Index
            </Link>
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap rescue-split">
          <div>
            <p className="rescue-kicker">Built for uncommon access</p>
            <h2>Help Organized Around The Structure</h2>
          </div>
          <p>
            The service map separates mobile-home plumbing, RV plumbing, burst-pipe response, water extraction, and
            repair-cost questions because each job starts with different access points. Skirting, slide-outs, underbelly
            insulation, compact shutoffs, park utilities, and older supply lines all change what should happen first.
          </p>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <h2>Core Service Hubs</h2>
          <div className="rescue-grid rescue-grid-3">
            {SERVICE_PILLARS.map((page) => (
              <Link className="rescue-card rescue-card-link" href={toPath(page.pageSlug)} key={page.pageSlug}>
                <span>{page.pageType}</span>
                <h3>{page.pageTitle.replace(/\s*\|.*/, "")}</h3>
                <p>{page.searchIntent} support with direct phone routing and related city pages.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-soft">
        <div className="rescue-wrap">
          <h2>High-Urgency Pages</h2>
          <div className="rescue-grid rescue-grid-4">
            {SUPPORT_PAGES.slice(0, 12).map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section">
        <div className="rescue-wrap">
          <h2>Popular City Routes</h2>
          <div className="rescue-grid rescue-grid-4">
            {CITY_PAGES.slice(0, 28).map((page) => (
              <Link className="rescue-chip" href={toPath(page.pageSlug)} key={page.pageSlug}>
                {linkLabel(page)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rescue-section rescue-band">
        <div className="rescue-wrap">
          <h2>Common Questions</h2>
          <div className="rescue-grid rescue-grid-3">
            {homeFaqs.map((faq) => (
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
