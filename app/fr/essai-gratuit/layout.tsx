import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Essai gratuit de 2 semaines | Ca-Ca Canin",
  description: "10 places seulement : un essai gratuit de 2 semaines de ramassage de crottes de chien pour les propriétaires de Laval et de la Rive-Nord, en échange de vos commentaires.",
  alternates: {
    canonical: "/fr/essai-gratuit",
    languages: {
      en: "/free-trial",
      fr: "/fr/essai-gratuit",
    },
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Essai gratuit de 2 semaines | Ca-Ca Canin",
    description: "10 places seulement : un essai gratuit de 2 semaines en échange de vos commentaires.",
    url: "/fr/essai-gratuit",
    type: "website",
  },
}

export default function EssaiGratuitLayout({ children }: { children: React.ReactNode }) {
  return children
}
