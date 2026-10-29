"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  Fingerprint,
  Check,
  Layers,
  FileCheck2,
} from "lucide-react";
import { Logo, Language, useLocale, Pill } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
export default function Home() {
  const { locale, setLocale } = useLocale();
  const t = getDictionary(locale);
  return (
    <div className="marketing">
      <header className="marketing-nav">
        <Logo />
        <nav>
          <a href="#product">{t.navProduct}</a>
          <a href="#how">{t.navHow}</a>
          <a href="#pricing">{t.navPricing}</a>
        </nav>
        <div className="nav-actions">
          <Language locale={locale} onChange={setLocale} />
          <Link href="/demo/" className="btn dark small">
            {t.navDemo}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-dot" />
              {t.eyebrow}
            </p>
            <h1>{t.homeTitle}</h1>
            <p className="hero-description">{t.homeSub}</p>
            <div className="hero-actions">
              <Link className="btn dark" href="/demo/">
                {t.tryDemo}
                <ArrowRight size={18} />
              </Link>
              <a className="text-link" href="#pricing">
                {t.seePricing}
                <ArrowUpRight size={16} />
              </a>
            </div>
            <a
              className="text-link tour-link"
              href="/media/kestrel-tour.mp4"
              target="_blank"
              rel="noreferrer"
            >
              {t.tour}
              <ArrowUpRight size={14} />
            </a>
            <div className="hero-foot">
              <span className="avatar-stack">
                <b>SB</b>
                <b>OR</b>
                <b>ER</b>
              </span>
              <span>
                {t.demo}
                <br />
                <small>Northwind Studio · 14 {t.tools.toLowerCase()}</small>
              </span>
            </div>
          </div>
          <div className="hero-product">
            <div className="product-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
                <p>Northwind Studio / {t.overview}</p>
                <ShieldCheck size={14} />
              </div>
              <div className="mini-app">
                <aside>
                  <span className="mini-feather">
                    <Layers size={20} />
                  </span>
                  {[Layers, ShieldCheck, BookOpen, FileCheck2].map(
                    (Icon, i) => (
                      <div className={i === 0 ? "chosen" : ""} key={i}>
                        <Icon size={17} />
                      </div>
                    ),
                  )}
                </aside>
                <div className="mini-main">
                  <div className="mini-title">
                    <div>
                      <p className="eyebrow">WORKSPACE OVERVIEW</p>
                      <h3>{t.northwind}</h3>
                    </div>
                    <Pill>{t.demo}</Pill>
                  </div>
                  <div className="mini-metrics">
                    <div>
                      <span>{t.tools}</span>
                      <strong>14</strong>
                      <small>11 {t.reviewed.toLowerCase()}</small>
                    </div>
                    <div>
                      <span>{t.employees}</span>
                      <strong>
                        18<span>/23</span>
                      </strong>
                      <small>78% {t.completed.toLowerCase()}</small>
                    </div>
                  </div>
                  <div className="mini-panel">
                    <div>
                      <h4>{t.distribution}</h4>
                      <p>{t.distributionSub}</p>
                    </div>
                    <div className="mini-chart">
                      <div className="donut">
                        <div>
                          <strong>14</strong>
                          <small>{t.tools}</small>
                        </div>
                      </div>
                      <div className="chart-legend">
                        <p>
                          <i className="dot teal" />
                          {t.low}
                          <b>8</b>
                        </p>
                        <p>
                          <i className="dot amber" />
                          {t.transparency}
                          <b>5</b>
                        </p>
                        <p>
                          <i className="dot rose" />
                          {t.review}
                          <b>1</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mini-row">
                    <span className="tool-icon">A</span>
                    <div>
                      <b>Assist Chat</b>
                      <small>Internal briefs · Sofia Bennett</small>
                    </div>
                    <Pill>{t.reviewed}</Pill>
                  </div>
                  <div className="mini-row">
                    <span className="tool-icon amber-icon">T</span>
                    <div>
                      <b>Talent Lens</b>
                      <small>Recruitment · Isabella Clark</small>
                    </div>
                    <Pill tone="amber">{t.review}</Pill>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-evidence">
              <span>
                <FileCheck2 size={22} />
              </span>
              <div>
                <b>{t.packTitle}</b>
                <small>PDF + DOCX · {t.demo}</small>
              </div>
              <Check size={18} />
            </div>
          </div>
        </section>
        <section id="product" className="product-section">
          <div className="section-heading">
            <p className="eyebrow">01 / {t.navProduct.toUpperCase()}</p>
            <h2>{t.promise}</h2>
          </div>
          <div className="feature-grid">
            {[
              [Layers, t.p1, t.p1b],
              [BookOpen, t.p2, t.p2b],
              [Fingerprint, t.p3, t.p3b],
            ].map(([Icon, title, body], i) => {
              const I = Icon as typeof Layers;
              return (
                <article key={i}>
                  <span className="feature-icon">
                    <I size={25} />
                  </span>
                  <span className="feature-number">0{i + 1}</span>
                  <h3>{title as string}</h3>
                  <p>{body as string}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section id="how" className="how-section">
          <div>
            <p className="eyebrow">02 / {t.navHow.toUpperCase()}</p>
            <h2>{t.workflow}</h2>
            <p className="muted">{t.legal}</p>
          </div>
          <div className="steps">
            {[t.step1, t.step2, t.step3, t.step4].map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <h3>{s}</h3>
                <ArrowUpRight size={20} />
              </div>
            ))}
          </div>
        </section>
        <section id="pricing" className="pricing-section">
          <div className="section-heading">
            <p className="eyebrow">03 / {t.navPricing.toUpperCase()}</p>
            <h2>{t.pricingTitle}</h2>
            <p>{t.pricingSub}</p>
          </div>
          <div className="pricing-grid">
            {[
              [t.setup, "€1,500–3,000", "$1,500–3,000", t.setupDetail],
              [t.company, "€149–399", "$149–399", t.companyDetail],
              [t.agencyPlan, "€699", "$699", t.agencyDetail],
            ].map(([title, eur, usd, desc], i) => (
              <article key={title} className={i === 1 ? "highlight" : ""}>
                <p className="eyebrow">{title}</p>
                <h3>
                  {eur}
                  <small>{i > 0 ? t.monthly : ""}</small>
                </h3>
                <p className="usd">
                  {usd}
                  {i > 0 ? t.monthly : ""}
                </p>
                <p>{desc}</p>
                <Link
                  href="/demo/"
                  className={`btn ${i === 1 ? "dark" : "outline"}`}
                >
                  {t.tryDemo}
                  <ArrowUpRight size={17} />
                </Link>
              </article>
            ))}
          </div>
          <p className="billing-note">{t.billingNote}</p>
        </section>
        <section className="cta-section">
          <div>
            <p className="eyebrow">KESTREL / NORTHWIND STUDIO</p>
            <h2>{t.cta}</h2>
            <p>{t.ctaSub}</p>
          </div>
          <Link href="/demo/" className="btn cream">
            {t.tryDemo}
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="marketing-footer">
        <Logo />
        <p>{t.footer}</p>
        <small>
          Copyright (c) 2026 Mariano Campuzano. All rights reserved.
        </small>
      </footer>
    </div>
  );
}
