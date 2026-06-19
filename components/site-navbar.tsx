"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PHONE_DISPLAY, PHONE_E164, PILLAR_PAGES, SITE_NAME, pageListLabel, toPath } from "@/lib/site-data";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [compactCall, setCompactCall] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCompactCall(window.matchMedia("(max-width: 900px)").matches && window.scrollY > 96);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="site-topline">
          <div className="site-shell site-topline-inner">
            <span>Septic and sump pump help across Canada</span>
            <a href={`tel:${PHONE_E164}`}>Call {PHONE_DISPLAY}</a>
          </div>
        </div>
        <div className="site-shell site-nav">
          <Link href="/" className="site-brand" aria-label={SITE_NAME} onClick={() => setOpen(false)}>
            <Image src="/logo.svg" alt="Sump & Septic Co. logo" width={52} height={52} priority />
            <span>
              <strong>{SITE_NAME}</strong>
              <small>Fast help, clear next steps</small>
            </span>
          </Link>

          <nav className="site-links" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <div
              className={`site-services ${servicesOpen ? "site-services-open" : ""}`}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocusCapture={() => setServicesOpen(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setServicesOpen(false);
                }
              }}
            >
              <Link href="/services" className="site-services-trigger" onClick={() => setOpen(false)}>
                Services
                <span aria-hidden="true">▾</span>
              </Link>
              <div className="site-services-menu" role="menu" aria-label="Service pages">
                {PILLAR_PAGES.map((page) => (
                  <Link key={page.pageSlug} href={toPath(page.pageSlug)} role="menuitem" onClick={() => setOpen(false)}>
                    {pageListLabel(page)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="site-nav-actions">
            <a className="site-call site-call-desktop" href={`tel:${PHONE_E164}`}>
              Call {PHONE_DISPLAY}
            </a>
            <button
              type="button"
              className="site-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`site-drawer ${open ? "site-drawer-open" : ""}`} aria-hidden={!open}>
        <button className="site-drawer-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} />
        <aside className="site-drawer-panel">
          <p className="site-drawer-eyebrow">Quick access</p>
          <nav className="site-drawer-links" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            {PILLAR_PAGES.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)} onClick={() => setOpen(false)}>
                {pageListLabel(page)}
              </Link>
            ))}
          </nav>
          <a className="site-call site-call-block" href={`tel:${PHONE_E164}`} onClick={() => setOpen(false)}>
            Call {PHONE_DISPLAY}
          </a>
        </aside>
      </div>

      <div className={`site-float-call ${compactCall && !open ? "site-float-call-show" : ""}`}>
        <a className="site-call" href={`tel:${PHONE_E164}`}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </>
  );
}
