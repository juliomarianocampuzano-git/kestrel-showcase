import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/manrope";
import "./redesign.css";
export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "Kestrel — AI governance, ready to show",
  description:
    "A workspace for AI inventories, literacy records, transparency notices and verifiable evidence. Explore a fictional demo.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
