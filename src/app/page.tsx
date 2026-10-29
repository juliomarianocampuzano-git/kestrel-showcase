"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Layers,
  FileCheck2,
  Check,
  Play,
  Plus,
  Menu,
  X,
  Feather,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Logo, Language, useLocale } from "@/components/ui";
import LandingPreview from "@/components/landing-preview";
import { getDictionary } from "@/lib/i18n";
import { designCopy } from "@/lib/design-copy";
export default function Home() {
  const { locale, setLocale } = useLocale();
  const t = getDictionary(locale),
    d = designCopy[locale];
  const [menu, setMenu] = useState(false),
    [step, setStep] = useState(0),
    [currency, setCurrency] = useState<"EUR" | "USD">("EUR");
  const stepTabs = ["inventory", "risk", "training", "evidence"];
  return (
    <div className="marketing redesign">
      <a href="#main-content" className="skip-link">
        {d.skip}
      </a>
      <div className="announcement">
        <span className="announcement-dot" />
        {d.announcement}
        <ArrowUpRight size={13} />
      </div>
      <header className="marketing-nav">
        <Logo />
        <nav aria-label={t.navProduct} className={menu ? "mobile-open" : ""}>
          {[
            [t.navProduct, "product"],
            [t.navHow, "how"],
            [t.navPricing, "pricing"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <Language locale={locale} onChange={setLocale} />
          <Link className="btn dark small" href="/demo/">
            {t.navDemo}
            <ArrowUpRight size={15} />
          </Link>
          <button
            className="marketing-menu"
            aria-label={menu ? d.closeMenu : d.menu}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-badge">
              <span className="badge-mark">
                <Feather size={13} />
              </span>
              {d.heroBadge}
            </p>
            <h1>
              {d.heroStart} <span>{d.heroEnd}</span>
            </h1>
            <p className="hero-description">{t.homeSub}</p>
            <div className="hero-actions">
              <Link className="btn dark" href="/demo/">
                {t.tryDemo}
                <ArrowUpRight size={18} />
              </Link>
              <a
                className="tour-button"
                href="/media/kestrel-tour.mp4"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <Play size={14} fill="currentColor" />
                </span>
                {t.tour}
              </a>
            </div>
            <div className="hero-assurance">
              <span>
                <CheckCircle2 size={15} />
                {t.ctaSub}
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="preview-caption">
              <span className="tiny-dot" />
              {d.preview}
              <span className="preview-caption-end">{t.demo}</span>
            </div>
            <LandingPreview t={t} />
            <p className="preview-caption-bottom">
              {d.previewNote}
              <ArrowUpRight size={13} />
            </p>
          </div>
        </section>
        <section className="capability-rail" aria-label={t.navProduct}>
          {[
            [Layers, t.inventory],
            [ShieldCheck, t.risk],
            [BookOpen, t.training],
            [FileCheck2, t.evidence],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof Layers;
            return (
              <Link href={`/demo/?tab=${stepTabs[i]}`} key={i}>
                <span>0{i + 1}</span>
                <I size={21} />
                <b>{label as string}</b>
                <ArrowUpRight size={15} />
              </Link>
            );
          })}
        </section>
        <section className="product-section" id="product">
          <div className="section-heading">
            <p className="eyebrow">{d.productKicker}</p>
            <h2>{d.productTitle}</h2>
            <p>{d.productBody}</p>
          </div>
          <div className="feature-grid">
            <article className="feature-inventory">
              <span className="feature-icon">
                <Layers size={25} />
              </span>
              <p className="feature-number">01 / {t.inventory}</p>
              <h3>{t.p1}</h3>
              <p>{t.p1b}</p>
              <div className="feature-register" aria-label={t.demo}>
                <div className="register-heading">
                  <span>{t.inventory}</span>
                  <span className="register-count">14</span>
                </div>
                {[
                  ["A", "Assist Chat", "Sofia Bennett"],
                  ["C", "Codewing", "Oliver Reed"],
                  ["S", "Support Finch", "Mia Laurent"],
                ].map(([initial, name, owner]) => (
                  <div className="register-row" key={name}>
                    <span>{initial}</span>
                    <b>
                      {name}
                      <small>{owner}</small>
                    </b>
                    <CheckCircle2 size={17} />
                  </div>
                ))}
                <Link href="/demo/?tab=inventory">
                  {t.view}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
            <article className="feature-learning">
              <div className="feature-side-copy">
                <span className="feature-icon">
                  <BookOpen size={24} />
                </span>
                <h3>{t.p2}</h3>
                <p>{t.p2b}</p>
                <Link className="feature-link" href="/demo/?tab=training">
                  {t.training}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <div className="learning-art" aria-label="18 / 23">
                <div className="learning-orbit">
                  <BookOpen size={29} />
                </div>
                <strong>
                  18<span>/23</span>
                </strong>
                <small>{t.completed}</small>
              </div>
            </article>
            <article className="feature-evidence">
              <div className="feature-side-copy">
                <span className="feature-icon">
                  <FileCheck2 size={24} />
                </span>
                <h3>{t.p3}</h3>
                <p>{t.p3b}</p>
                <Link className="feature-link" href="/demo/?tab=evidence">
                  {t.evidence}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <div className="document-art" aria-hidden="true">
                <FileCheck2 size={34} />
                <i />
                <i />
                <i />
                <span>PDF + DOCX</span>
                <b>
                  <Check size={18} />
                </b>
              </div>
            </article>
          </div>
        </section>
        <section className="how-section" id="how">
          <div className="workflow-copy">
            <p className="eyebrow">{d.workflowKicker}</p>
            <h2>{d.workflowTitle}</h2>
            <p className="muted">{t.legal}</p>
            <div className="steps">
              {[t.step1, t.step2, t.step3, t.step4].map((label, i) => (
                <button
                  key={label}
                  aria-pressed={step === i}
                  className={step === i ? "selected" : ""}
                  onClick={() => setStep(i)}
                >
                  <span>0{i + 1}</span>
                  <b>{label}</b>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>
          <div className="workflow-preview">
            <div className="workflow-preview-top">
              <span>
                <Feather size={16} />
                Northwind Studio
              </span>
              <span>{d.sampleTag}</span>
            </div>
            <div className={`workflow-illustration step-${step}`} key={step}>
              <span className="workflow-step-index">0{step + 1}</span>
              {step === 0 ? (
                <Layers size={47} />
              ) : step === 1 ? (
                <ShieldCheck size={47} />
              ) : step === 2 ? (
                <BookOpen size={47} />
              ) : (
                <FileCheck2 size={47} />
              )}
              <h3>{[t.step1, t.step2, t.step3, t.step4][step]}</h3>
              <p>{d.workflowDetails[step]}</p>
              <div className="workflow-record">
                <CheckCircle2 size={19} />
                <span>
                  {step === 0
                    ? "14"
                    : step === 1
                      ? "11"
                      : step === 2
                        ? "18 / 23"
                        : "PDF + DOCX"}
                </span>
                <small>
                  {[t.tools, t.reviewed, t.completed, t.demo][step]}
                </small>
              </div>
              <Link
                href={`/demo/?tab=${stepTabs[step]}`}
                className="btn outline"
              >
                {d.workflowLink}
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="workflow-progress" aria-hidden="true">
              {stepTabs.map((s, i) => (
                <i className={i <= step ? "done" : ""} key={s} />
              ))}
            </div>
          </div>
        </section>
        <section className="pricing-section" id="pricing">
          <div className="pricing-heading">
            <div className="section-heading">
              <p className="eyebrow">{d.pricingFooter}</p>
              <h2>{t.pricingTitle}</h2>
              <p>{t.pricingSub}</p>
            </div>
            <div className="currency-switch" aria-label="Currency">
              {(["EUR", "USD"] as const).map((c) => (
                <button
                  key={c}
                  aria-pressed={currency === c}
                  className={currency === c ? "selected" : ""}
                  onClick={() => setCurrency(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="pricing-grid">
            {[
              [t.setup, "€1,500–3,000", "$1,500–3,000", t.setupDetail],
              [t.company, "€149–399", "$149–399", t.companyDetail],
              [t.agencyPlan, "€699", "$699", t.agencyDetail],
            ].map(([title, eur, usd, desc], i) => (
              <article className={i === 1 ? "highlight" : ""} key={title}>
                {i === 1 && (
                  <span className="pricing-badge">{d.pricingBadge}</span>
                )}
                <p className="eyebrow">{title}</p>
                <h3>{currency === "EUR" ? eur : usd}</h3>
                <span className="price-period">
                  {i > 0 ? t.monthly : t.setup}
                </span>
                <p className="usd">
                  {currency === "EUR" ? usd : eur}
                  {i > 0 ? ` ${t.monthly}` : ""}
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
        <section className="faq-section">
          <div className="section-heading">
            <p className="eyebrow">{d.faqKicker}</p>
            <h2>{d.faqTitle}</h2>
            <p>{t.footer}</p>
          </div>
          <div className="faq-list">
            {d.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus size={19} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="cta-section">
          <div className="cta-orbit" aria-hidden="true" />
          <div>
            <p className="eyebrow">KESTREL / AI GOVERNANCE</p>
            <h2>
              {d.closingStart} <span>{d.closingEnd}</span>
            </h2>
            <p>{t.ctaSub}</p>
          </div>
          <Link href="/demo/" className="btn cream">
            {t.tryDemo}
            <ArrowUpRight size={20} />
          </Link>
        </section>
      </main>
      <footer className="marketing-footer">
        <div>
          <Logo />
          <p>{t.footer}</p>
        </div>
        <nav aria-label={t.navProduct}>
          <a href="#product">{t.navProduct}</a>
          <a href="#pricing">{t.navPricing}</a>
          <Link href="/demo/">
            {t.navDemo}
            <ArrowUpRight size={13} />
          </Link>
        </nav>
        <small>
          Copyright (c) 2026 Mariano Campuzano. All rights reserved.
        </small>
      </footer>
    </div>
  );
}
