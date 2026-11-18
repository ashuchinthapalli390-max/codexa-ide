import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config/site";
import { CinematicLoader } from "@/components/motion/CinematicLoader";
import { PageTransitionProvider } from "@/components/motion/PageTransitionProvider";
import { FloatingWidgetManager } from "@/components/floating/FloatingWidgetManager";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CodeXa Studio IDE — Official AI Development Environment",
    template: "%s | CodeXa Studio IDE",
  },
  description: siteConfig.description,
  keywords: [
    "CodeXa Studio IDE",
    "CodeXa Agency",
    "AI IDE",
    "Autonomous developer workspace",
    "Local-first code editor",
    "Multi-model coding",
    "GPT-6 Astra",
    "Fabel 5.1",
    "NEXA AI",
  ],
  authors: [{ name: "CodeXa Agency", url: siteConfig.agencyUrl }],
  creator: "CodeXa Agency",
  publisher: "CodeXa Agency",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "CodeXa Studio IDE — Official AI Development Environment",
    description: siteConfig.description,
    siteName: "CodeXa Studio IDE",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "CodeXa Studio IDE Official Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeXa Studio IDE — Official AI Development Environment",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/codexa-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ backgroundColor: "#000000" }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Quicksand:wght@300..700&family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&family=Playfair+Display:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#000000] text-white min-h-screen selection:bg-white selection:text-black font-sans overflow-x-clip max-w-full">
        <AuthProvider>
          {/* Cinematic Minimal Intro Sequence (First visit per session only) */}
          <CinematicLoader />

          <Navbar />

          {/* Page Transition & Hydration Settling */}
          <PageTransitionProvider>
            <main className="min-h-screen w-full max-w-full overflow-x-clip">{children}</main>
          </PageTransitionProvider>

          <Footer />

          {/* Floating Offer Pill & Release Notification Collision Coordinator */}
          <FloatingWidgetManager />
        </AuthProvider>
      </body>
    </html>
  );
}
