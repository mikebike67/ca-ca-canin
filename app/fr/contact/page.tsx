import Link from "next/link";
import type { Metadata } from "next";
import LegalPageShell from "@/components/legal-page-shell";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact | Ca-Ca Canin",
  description: "Contactez Ca-Ca Canin pour les demandes de devis, les questions de zone de service et le nettoyage printanier.",
  alternates: {
    canonical: "/fr/contact",
    languages: {
      en: "/contact",
      fr: "/fr/contact",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact | Ca-Ca Canin",
    description: "Contactez Ca-Ca Canin pour les demandes de devis, les questions de zone de service et le nettoyage printanier.",
    url: "https://cacacanin.com/fr/contact",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    type: "website",
  },
};

export default function FrenchContactPage() {
  return (
    <LegalPageShell locale="fr">
      <div className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#724420]">
            Laval et Rive-Nord, QC
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Contacter Ca-Ca Canin
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            Ecrivez-nous pour un devis, une question sur la zone de service, une demande de nettoyage printanier ou un code postal qui ne passe pas dans le formulaire.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="tel:+14388808922" className="inline-flex items-center justify-center rounded-full bg-[#307944] px-6 py-3 text-sm font-semibold text-white hover:bg-[#256336]">
              Appeler le 438 880 8922
            </a>
            <a href="mailto:cacacaninqc@gmail.com" className="inline-flex items-center justify-center rounded-full border border-[#307944] px-6 py-3 text-sm font-semibold text-[#307944] hover:bg-[#eef7f0]">
              Envoyer un courriel
            </a>
          </div>
        </section>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Telephone</h2>
            <p className="mt-3 text-gray-600">La facon la plus rapide de confirmer la disponibilite ou de poser une question sur un devis.</p>
            <p className="mt-4">
              <a href="tel:+14388808922" className="font-semibold text-[#307944] hover:underline">
                438 880 8922
              </a>
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Courriel</h2>
            <p className="mt-3 text-gray-600">Ideal pour les details de devis, les questions de zone de service ou le suivi apres un formulaire.</p>
            <p className="mt-4">
              <a href="mailto:cacacaninqc@gmail.com" className="font-semibold text-[#307944] hover:underline">
                cacacaninqc@gmail.com
              </a>
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <h2 className="text-2xl font-bold text-gray-900">Zone de service</h2>
            <p className="mt-3 text-gray-600">
              Le service regulier de ramassage est concentre sur Laval. Le nettoyage printanier couvre aussi certaines villes de la Rive-Nord affichees sur les pages dediees.
            </p>
          </section>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <div className="mb-6 border-b border-[#d7e6da] pb-6">
            <Link href="/fr" className="text-sm font-semibold text-[#307944] hover:underline">
              Retour a l'accueil
            </Link>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Besoin d'aide en dehors du formulaire?
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Si votre code postal est a l'exterieur de la zone actuellement desservie, ou si vous voulez confirmer si
              nous pouvons vous aider, contactez-nous directement et nous verifierons votre demande.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <ContactForm locale="fr" />
        </div>
      </div>
    </LegalPageShell>
  );
}
