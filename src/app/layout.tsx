import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Resume Builder — free, ATS-aware, runs in your browser",
    template: "%s · Resume Builder",
  },
  description:
    "Build a resume from 77 templates tagged by industry and marked for ATS safety. Live A4 preview, a checker that names what is wrong, PDF export. No account, nothing uploaded.",
  keywords: [
    "resume builder",
    "CV maker",
    "ATS resume",
    "Philippines resume format",
    "free resume template",
  ],
  openGraph: {
    title: "Resume Builder — free, ATS-aware, runs in your browser",
    description:
      "77 templates, a live A4 preview and a checker that tells you exactly what to fix. No account, nothing uploaded.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
