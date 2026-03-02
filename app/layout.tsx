import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

export const metadata: Metadata = {
  title: "Ca-Ca Canin - Laval's Premier Pooper Scooper Service",
  description: "Ca-Ca Canin provides reliable, hassle-free dog waste removal services throughout Laval, Quebec. Get your free quote today!",
  alternates: {
    languages: {
      en: "/",
      fr: "/fr"
    }
  },
  openGraph: {
    title: "Ca-Ca Canin - Laval's Premier Pooper Scooper Service",
    description: "Reliable, hassle-free dog waste removal services throughout Laval, Quebec.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Ca-Ca Canin - Laval's Premier Pooper Scooper Service",
    description: "Reliable, hassle-free dog waste removal services throughout Laval, Quebec."
  },
  icons: {
    icon: [
      {
        url: "/images/cacacaninlogo.jpg",
        type: "image/jpeg",
        sizes: "32x32"
      },
      {
        url: "/images/cacacaninlogo.jpg",
        type: "image/jpeg",
        sizes: "16x16"
      }
    ],
    apple: [
      {
        url: "/images/cacacaninlogo.jpg",
        type: "image/jpeg",
        sizes: "180x180"
      }
    ],
    shortcut: [{ url: "/images/ca-ca-canin-logo.svg" }],
    other: [
      {
        rel: "icon",
        url: "/images/cacacaninlogo.jpg",
      },
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: 'device-width',
    initialScale: 1
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/images/cacacaninlogo.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/images/cacacaninlogo.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/cacacaninlogo.jpg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.className} bg-white`}>{children}</body>
    </html>
  );
}
