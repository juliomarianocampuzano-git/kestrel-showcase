"use client";
import { Feather, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className={`logo ${light ? "light" : ""}`}
      aria-label="Kestrel home"
    >
      <span className="logo-mark">
        <Feather size={21} />
      </span>
      kestrel<span className="logo-dot">.</span>
    </a>
  );
}
export function useLocale() {
  const [locale, set] = useState<Locale>("en");
  useEffect(() => {
    const l = localStorage.getItem("kestrel.locale");
    if (l === "en" || l === "it" || l === "es") set(l);
  }, []);
  function setLocale(l: Locale) {
    set(l);
    localStorage.setItem("kestrel.locale", l);
    document.documentElement.lang = l;
  }
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return { locale, setLocale };
}
export function Language({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <select
      className="language"
      aria-label="Language / Lingua / Idioma"
      value={locale}
      onChange={(e) => onChange(e.target.value as Locale)}
    >
      <option value="en">EN</option>
      <option value="it">IT</option>
      <option value="es">ES</option>
    </select>
  );
}
export function Pill({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <span className={`pill ${tone}`}>
      <i />
      {children}
    </span>
  );
}
export function Arrow() {
  return <ArrowUpRight size={17} />;
}
