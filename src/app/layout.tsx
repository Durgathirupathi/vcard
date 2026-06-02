import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "./ScrollToTop";

export const metadata: Metadata = {
  title: "VCard Studio | Premium Multi-Tenant Digital Business Cards",
  description: "Create beautiful, high-performance, and secure digital business profiles with real-time VCF contact downloads, lead capture systems, and centralized analytics.",
  keywords: ["digital business card", "vcard builder", "nfc card", "virtual contact profile", "business card generator"],
  authors: [{ name: "VCard Studio Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-stone-50 text-stone-900 selection:bg-brown-200/40 selection:text-brown-900">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
