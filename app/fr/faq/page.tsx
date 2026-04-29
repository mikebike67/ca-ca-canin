import type { Metadata } from "next"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "FAQ | Ramassage de déjections canines Laval & Rive-Nord | Ca-Ca Canin",
  description: "Réponses aux questions les plus courantes sur le service de ramassage de déjections canines de Ca-Ca Canin : tarifs, horaires, zone de service et ce qui se passe après chaque visite.",
  alternates: {
    canonical: "/fr/faq",
    languages: { en: "/faq", fr: "/fr/faq" },
  },
}

const faqs = [
  {
    q: "Combien coûte le service régulier de ramassage?",
    a: "Le service hebdomadaire commence à 20 $ par visite pour un chien dans une cour standard. Le prix varie selon le nombre de chiens, la taille de la cour et la fréquence. Utilisez le calculateur sur la page de réservation pour voir votre estimation.",
  },
  {
    q: "Dois-je signer un contrat?",
    a: "Aucun contrat requis. Vous pouvez demander le service et ajuster ou annuler à tout moment en contactant notre équipe.",
  },
  {
    q: "Dois-je être sur place lors de la visite?",
    a: "Non. Si nous avons accès à votre portail, nous pouvons effectuer la visite et vous envoyer une confirmation avec une photo du portail ensuite.",
  },
  {
    q: "Quelles villes desservez-vous?",
    a: "Nous desservons Laval et certaines villes de la Rive-Nord, notamment Blainville, Boisbriand, Bois-des-Filion, Deux-Montagnes, Lorraine, Mirabel, Oka, Pointe-Calumet, Rosemère, Saint-Eustache, Saint-Joseph-du-Lac, Sainte-Anne-des-Plaines, Sainte-Marthe-sur-le-Lac et Sainte-Thérèse. Entrez votre code postal pour confirmer la disponibilité.",
  },
  {
    q: "Nettoyez-vous toute la cour?",
    a: "Oui. Nous nettoyons les zones de votre propriété où des déjections sont présentes, y compris les cours avant, arrière et côtés, ainsi que les enclos et espaces similaires.",
  },
  {
    q: "Comment les déchets sont-ils disposés?",
    a: "Les déchets sont mis dans des sacs et placés dans votre bac à ordures extérieur si disponible. Si le bac n'est pas accessible, la disposition est gérée selon l'entente de service.",
  },
  {
    q: "Que se passe-t-il après chaque visite?",
    a: "Vous recevez une confirmation de service, et nous fournissons une photo du portail après la visite pour que vous sachiez toujours que le travail a été fait.",
  },
  {
    q: "Le service est-il disponible toute l'année?",
    a: "Oui. Nous offrons le service de ramassage de déjections canines toute l'année, y compris en conditions hivernales lorsque le nettoyage est encore accessible.",
  },
  {
    q: "Qu'est-ce que le nettoyage de printemps et en quoi diffère-t-il du service régulier?",
    a: "Le nettoyage de printemps est un nettoyage en profondeur ponctuel de votre cour pour enlever l'accumulation de l'hiver. Il commence à 60 $ pour les 30 premières minutes, puis 5 $ pour chaque tranche additionnelle de 5 minutes. Le service régulier récurrent maintient la cour propre semaine après semaine.",
  },
  {
    q: "Dans quel délai puis-je commencer?",
    a: "La plupart des demandes sont confirmées dans le jour ouvrable suivant. Soumettez une demande de devis et notre équipe vous contactera pour confirmer votre horaire.",
  },
]

export default function FaqFrenchPage() {
  return (
    <div lang="fr" className="flex flex-col min-h-screen bg-white text-gray-900">
      <SiteHeader locale="fr" altHref="/faq" ctaLabel="Vérifier la disponibilité" />

      <main id="main-content" className="flex-grow pt-16">
        {/* Hero */}
        <section className="bg-[#eef7f0] px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-green">FAQ</p>
            <h1 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
              Questions sur notre service
            </h1>
            <p className="text-lg text-gray-600">
              Des réponses claires sur les tarifs, les horaires, la zone de service et ce à quoi s'attendre lors d'une réservation.
            </p>
          </div>
        </section>

        {/* FAQ list */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#d7e6da] bg-white p-6 shadow-[0_14px_34px_rgba(17,24,39,0.05)]"
              >
                <h2 className="mb-2 text-lg font-bold text-gray-900">{faq.q}</h2>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Vous avez encore une question?</h2>
            <p className="mb-6 text-gray-600">
              Contactez-nous directement — nous répondons rapidement.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/fr/contact"
                className="rounded-full border-2 border-brand-green px-6 py-3 font-semibold text-brand-green hover:bg-[#eef7f0] transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/fr#quote-form"
                className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green-dark transition-colors"
              >
                Vérifier la disponibilité
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale="fr" />
    </div>
  )
}
