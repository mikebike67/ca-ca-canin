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
  title: "Dog Waste Removal in Laval, QC | Ca-Ca Canin",
  description: "Dog waste removal and pooper scooper service in Laval, QC. Get clear pricing, flexible scheduling, and a fast quote from Ca-Ca Canin.",
  alternates: {
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  openGraph: {
    title: "Dog Waste Removal in Laval, QC | Ca-Ca Canin",
    description: "Dog waste removal and pooper scooper service in Laval, QC with clear pricing and flexible scheduling.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Dog Waste Removal in Laval, QC | Ca-Ca Canin",
    description: "Dog waste removal and pooper scooper service in Laval, QC with clear pricing and flexible scheduling."
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
      <head>
        <link rel="icon" type="image/x-icon" href="/images/caca-caninfavicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/images/caca-caninfavicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/cacacaninlogo.jpg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.className} min-h-screen bg-white text-gray-900`}>{children}</body>
    </html>
  );
}
