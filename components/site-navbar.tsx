"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PHONE_DISPLAY, PHONE_E164, SERVICE_PILLARS, SITE_NAME, toPath } from "@/lib/site-data";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [showCall, setShowCall] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowCall(window.matchMedia("(max-width: 860px)").matches && window.scrollY > 80);
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
      <header className="rescue-header">
        <div className="rescue-wrap rescue-nav">
          <Link href="/" className="rescue-brand" aria-label={SITE_NAME} onClick={() => setOpen(false)}>
            <Image src="/logo.svg" alt="Mobile Home Rescue logo" width={42} height={42} priority />
            <span>{SITE_NAME}</span>
          </Link>
          <nav className="rescue-links" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            {SERVICE_PILLARS.slice(0, 3).map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)}>
                {page.pageTitle.replace(/\s*\|.*/, "")}
              </Link>
            ))}
          </nav>
          <a className="rescue-call rescue-call-desktop" href={`tel:${PHONE_E164}`}>
            Call {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            className="rescue-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`rescue-drawer ${open ? "rescue-drawer-open" : ""}`} aria-hidden={!open}>
        <button className="rescue-drawer-shade" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
        <aside className="rescue-drawer-panel">
          <nav className="rescue-drawer-links" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            {SERVICE_PILLARS.map((page) => (
              <Link key={page.pageSlug} href={toPath(page.pageSlug)} onClick={() => setOpen(false)}>
                {page.pageTitle.replace(/\s*\|.*/, "")}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <div className={`rescue-mobile-call ${showCall && !open ? "rescue-mobile-call-show" : ""}`}>
        <a className="rescue-call" href={`tel:${PHONE_E164}`}>
          Call {PHONE_DISPLAY}
        </a>
      </div>
    </>
  );
}
