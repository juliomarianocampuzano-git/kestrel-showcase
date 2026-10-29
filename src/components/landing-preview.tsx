"use client";
import Link from "next/link";
import {
  ShieldCheck,
  BookOpen,
  FileCheck2,
  Layers,
  Check,
  ArrowUpRight,
  Feather,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
type T = ReturnType<typeof getDictionary>;
export default function LandingPreview({ t }: { t: T }) {
  return (
    <div className="hero-product">
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="product-window">
        <div className="window-bar">
          <span />
          <span />
          <span />
          <p>kestrel / Northwind Studio</p>
          <ShieldCheck size={15} />
        </div>
        <div className="mini-app">
          <aside>
            <span className="mini-feather">
              <Feather size={22} />
            </span>
            {[Layers, ShieldCheck, BookOpen, FileCheck2].map((Icon, i) => (
              <div className={i === 0 ? "chosen" : ""} key={i}>
                <Icon size={19} />
              </div>
            ))}
          </aside>
          <div className="mini-main">
            <div className="mini-title">
              <div>
                <p className="eyebrow">{t.workspace}</p>
                <h3>{t.northwind}</h3>
              </div>
              <span className="preview-live">
                <i />
                {t.demo}
              </span>
            </div>
            <div className="mini-metrics">
              <Link href="/demo/?tab=inventory">
                <span>{t.tools}</span>
                <strong>14</strong>
                <small>
                  <Check size={11} />
                  11 {t.reviewed.toLowerCase()}
                </small>
              </Link>
              <Link href="/demo/?tab=training">
                <span>{t.employees}</span>
                <strong>
                  18<span>/23</span>
                </strong>
                <div className="mini-learning-bar">
                  <i />
                </div>
              </Link>
            </div>
            <div className="mini-panel">
              <div className="preview-panel-title">
                <h4>{t.distribution}</h4>
                <ArrowUpRight size={13} />
              </div>
              <p>{t.distributionSub}</p>
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
            <Link href="/demo/?tab=inventory" className="mini-row">
              <span className="tool-icon">A</span>
              <div>
                <b>Assist Chat</b>
                <small>Sofia Bennett</small>
              </div>
              <span className="pill green">
                <Check size={10} />
                {t.reviewed}
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Link href="/demo/?tab=evidence" className="floating-evidence">
        <span>
          <FileCheck2 size={25} />
        </span>
        <div>
          <b>{t.packTitle}</b>
          <small>PDF + DOCX · {t.demo}</small>
        </div>
        <span className="evidence-check">
          <Check size={15} />
        </span>
      </Link>
    </div>
  );
}
