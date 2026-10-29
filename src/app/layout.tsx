import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Kestrel — AI governance, ready to show",
  description:
    "A workspace for AI inventories, literacy records, transparency notices and verifiable evidence. Explore a fictional demo.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
