import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "À propos de Ca-Ca Canin | Ramassage de déjections canines Laval et Rive-Nord",
  description: "Ca-Ca Canin est un service local de ramassage de déjections canines à Laval et sur la Rive-Nord. Découvrez qui nous sommes et pourquoi nous l'avons créé.",
  alternates: {
    canonical: "/fr/a-propos",
    languages: { en: "/about", fr: "/fr/a-propos" },
  },
}

export default function AProposPage() {
  return (
    <div lang="fr" className="flex flex-col min-h-screen bg-white text-gray-900">
      <SiteHeader locale="fr" altHref="/about" ctaLabel="Vérifier la disponibilité" />

      <main id="main-content" className="flex-grow pt-16">
        {/* Hero */}
        <section className="bg-[#eef7f0] px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-green">À propos</p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
              On s'occupe du désordre pour que vous n'ayez pas à le faire
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Ca-Ca Canin est un service local de ramassage de déjections canines basé à Laval, au Québec. Nous servons les propriétaires à Laval et dans certaines villes de la Rive-Nord qui veulent une cour propre et utilisable sans faire le travail eux-mêmes.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Pourquoi Ca-Ca Canin existe</h2>
              <p className="mb-4 text-lg text-gray-700">
                Nous avons lancé ce service parce que nous entendions constamment la même chose de la part des propriétaires de chiens : le nettoyage de la cour est la corvée qui ne se fait jamais, et ça rend tout l'espace arrière inutilisable.
              </p>
              <p className="mb-4 text-lg text-gray-700">
                Ca-Ca Canin a été créé pour régler ça. Nous offrons un service de ramassage de déjections canines rapide, fiable et abordable pour les propriétaires à Laval et dans les villes voisines de la Rive-Nord. Pas de planification compliquée, pas de contrats, juste une cour propre et une chose de moins à laquelle penser.
              </p>
              <p className="text-lg text-gray-700">
                Notre service est conçu pour les familles, les professionnels occupés et tous ceux qui aiment leur chien mais préfèrent passer leurs fins de semaine autrement.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/our dog waste renewal company.png"
                alt="L'équipe Ca-Ca Canin prête pour une visite de nettoyage"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Comment nous travaillons</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Tarifs clairs",
                  body: "Vous voyez le prix avant de vous engager. Pas de frais cachés, pas de surprises en fin de mois.",
                },
                {
                  title: "Preuve de service",
                  body: "Nous envoyons une photo du portail après chaque visite pour que vous sachiez que le travail a été fait.",
                },
                {
                  title: "Sans engagement",
                  body: "Commencez, pausez ou annulez à tout moment. Nous méritons votre confiance à chaque visite.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]"
                >
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{v.title}</h3>
                  <p className="text-gray-600">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Prêt à commencer?</h2>
            <p className="mb-8 text-lg text-gray-600">
              Vérifiez la disponibilité dans votre secteur et obtenez un devis en quelques minutes. La plupart des demandes sont confirmées dans le jour ouvrable suivant.
            </p>
            <Link
              href="/fr#quote-form"
              className="inline-flex items-center rounded-full bg-brand-green px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-brand-green-dark transition-colors"
            >
              Vérifier la disponibilité
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale="fr" />
    </div>
  )
}
