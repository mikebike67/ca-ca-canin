import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cacacanin.com"),
  title: "Dog Poop Cleanup in Laval, QC | Ca-Ca Canin",
  description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval, QC. Get clear pricing, flexible scheduling, and a fast quote from Ca-Ca Canin.",
  applicationName: "Ca-Ca Canin",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Dog Poop Cleanup in Laval, QC | Ca-Ca Canin",
    description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval, QC with clear pricing and flexible scheduling.",
    type: "website",
    url: "/",
    siteName: "Ca-Ca Canin",
    locale: "en_CA"
  },
  twitter: {
    card: "summary",
    title: "Dog Poop Cleanup in Laval, QC | Ca-Ca Canin",
    description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval, QC with clear pricing and flexible scheduling."
  },
  icons: {
    icon: [
      {
        url: "/images/caca-caninfavicon.ico",
        type: "image/x-icon"
      }
    ],
    apple: [
      {
        url: "/images/cacacaninlogo.jpg",
        type: "image/jpeg",
        sizes: "180x180"
      }
    ],
    shortcut: [{ url: "/images/caca-caninfavicon.ico", type: "image/x-icon" }],
    other: [
      {
        rel: "icon",
        url: "/images/caca-caninfavicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  manifest: "/manifest.json",
};

// RESPONSIVE: use Next.js viewport export so mobile browsers receive the correct scaling meta tag.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${montserrat.className} min-h-screen bg-white text-gray-900`}>{children}</body>
    </html>
  );
}
