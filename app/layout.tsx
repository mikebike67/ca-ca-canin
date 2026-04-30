import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import MetaRouteEvents from "@/components/meta-route-events";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cacacanin.com"),
  title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
  description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval and select North Shore locations. Get clear pricing, flexible scheduling, and a fast quote from Ca-Ca Canin.",
  keywords: [
    "dog poop cleanup Laval",
    "dog waste removal Laval",
    "pooper scooper service Laval",
    "pet waste removal Laval",
    "spring cleanup Laval",
    "North Shore dog waste removal",
  ],
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
    title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval and select North Shore locations with clear pricing and flexible scheduling.",
    type: "website",
    url: "/",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin dog poop cleanup in Laval and the North Shore",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Dog Poop Cleanup Laval & North Shore | Ca-Ca Canin",
    description: "Dog poop cleanup, dog waste removal, and pooper scooper service in Laval and select North Shore locations with clear pricing and flexible scheduling.",
    images: ["/images/cacacaninlogo.jpg"],
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
        url: "/images/caca-caninfavicon.ico",
        type: "image/x-icon",
        sizes: "32x32"
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FHFNJ5L8JM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FHFNJ5L8JM');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            window.__cacacaninMetaPixel = window.__cacacaninMetaPixel || {};
            if (!window.__cacacaninMetaPixel.pageViewTracked) {
              window.__cacacaninMetaPixel.pageViewTracked = true;
              fbq('init', '2194469848018006');
              fbq('track', 'PageView');
            }
          `}
        </Script>
      </head>
      <body className={`${montserrat.className} min-h-screen bg-white text-gray-900`}>
        {children}
        <Suspense fallback={null}>
          <MetaRouteEvents />
        </Suspense>
      </body>
    </html>
  );
}
