import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "2 Weeks Free Trial | Ca-Ca Canin",
  description: "10 spots only: a free 2-week dog waste removal trial for homeowners in Laval and the North Shore, in exchange for your feedback.",
  alternates: {
    canonical: "/free-trial",
    languages: {
      en: "/free-trial",
      fr: "/fr/essai-gratuit",
    },
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "2 Weeks Free Trial | Ca-Ca Canin",
    description: "10 spots only: a free 2-week dog waste removal trial in exchange for your feedback.",
    url: "/free-trial",
    type: "website",
  },
}

export default function FreeTrialLayout({ children }: { children: React.ReactNode }) {
  return children
}
