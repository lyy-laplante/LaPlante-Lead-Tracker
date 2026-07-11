import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Tracker — LaPlante Appraisals",
  description: "Follow-up tracker for appraisal quote requests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
