import Link from "next/link";
import LegalPageShell from "@/components/legal-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Ca-Ca Canin",
  description: "Consultez les conditions d'utilisation de Ca-Ca Canin pour le ramassage de dejections canines a Laval et le nettoyage printanier.",
  alternates: {
    canonical: "/fr/terms",
    languages: {
      en: "/terms",
      fr: "/fr/terms",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Conditions d'utilisation | Ca-Ca Canin",
    description: "Consultez les conditions d'utilisation de Ca-Ca Canin pour le ramassage de dejections canines a Laval et le nettoyage printanier.",
    url: "https://cacacanin.com/fr/terms",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    type: "website",
  },
};

export default function FrenchTermsPage() {
  return (
    <LegalPageShell locale="fr">
      <main className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <div className="mb-10 border-b border-[#d7e6da] pb-6">
            <Link href="/fr" className="text-sm font-semibold text-[#307944] hover:underline">
              Retour a l'accueil
            </Link>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Conditions d'utilisation
            </h1>
            <p className="mt-3 text-base text-gray-600">Derniere mise a jour : 1 mars 2026</p>
          </div>

          <div className="space-y-10 text-gray-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">A propos de Ca-Ca Canin</h2>
              <p>
                Ca-Ca Canin offre le service de ramassage de dejections canines a Laval, Quebec et le nettoyage de printemps a Laval ainsi que dans certaines villes de la Rive-Nord.
                Les presentes conditions s'appliquent lorsque vous utilisez notre site web, demandez un devis ou reservez un service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Acceptation des conditions</h2>
              <p>
                En utilisant ce site web, en demandant un devis ou en reservant un service, vous acceptez ces conditions
                ainsi que notre politique de confidentialite. Si vous n'etes pas d'accord, n'utilisez pas le site et ne soumettez pas de demande.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Zone de service</h2>
              <p>
                Notre zone reguliere de service recurrent se limite actuellement a Laval, Quebec, et les codes postaux
                commencent generalement par <span className="font-semibold">H7</span>. Le nettoyage de printemps est aussi offert dans certaines zones de codes postaux de la Rive-Nord indiquees sur les pages de nettoyage printanier. Nous pouvons refuser ou annuler les demandes a l'exterieur de nos zones de service affichees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Devis et tarification</h2>
              <p>
                Tout calculateur de prix ou prix affiche sur le site constitue seulement une estimation. Le prix final est confirme par
                Ca-Ca Canin avant le service.
              </p>
              <p>
                Le nettoyage de printemps commence a <span className="font-semibold">60 $ pour les 30 premieres minutes</span>,
                plus <span className="font-semibold">5 $ pour chaque tranche additionnelle de 5 minutes</span>. Le temps est
                arrondi a la baisse a la tranche precedente de 5 minutes. Par exemple, une visite de 54 minutes est facturee comme 50 minutes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Acces et exigences de securite</h2>
              <p>
                Vous etes responsable de fournir un acces securitaire a la cour le jour du service. Les clotures et portails doivent etre
                accessibles, les animaux doivent etre gardes en securite lorsque necessaire, et vous devez nous informer de tout danger connu,
                notamment des animaux agressifs, clotures brisees, surfaces dangereuses, debris ou objets tranchants.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Horaire, reports et meteo</h2>
              <p>
                Nous pouvons ajuster l'heure des visites en raison des changements de route, de la meteo, des conditions de securite ou de problemes d'acces.
                Si une visite doit etre reportee, nous ferons des efforts raisonnables pour vous en aviser et fixer un nouveau moment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Annulations et visites manquees</h2>
              <p>
                Si vous devez annuler ou reporter, contactez-nous des que possible par telephone ou par courriel.
                Si nous ne pouvons pas acceder a la cour a l'heure prevue ou si les conditions sont dangereuses, nous pouvons considerer
                cela comme une visite manquee et reporter le service ou facturer le temps reserve, selon la situation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Paiement et service recurrent</h2>
              <p>
                Les services recurrents peuvent etre factures selon l'horaire qui vous est fourni lors de l'inscription. Les taxes applicables peuvent
                etre ajoutees lorsque requis. Le service est offert sans contrat a long terme, et vous pouvez annuler en tout temps par telephone ou par courriel.
                Les demandes d'annulation s'appliquent aux services futurs et n'annulent pas les services deja effectues.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Communications et SMS</h2>
              <p>
                En soumettant un formulaire et en cochant la case de consentement, vous acceptez que Ca-Ca Canin puisse vous contacter par telephone,
                message texte et courriel au sujet de votre demande de devis, de la planification, des mises a jour de service et du soutien a la clientele.
                Si la messagerie texte est utilisee, vous pouvez vous desabonner en repondant <span className="font-semibold">STOP</span>.
                Des frais de messagerie et de donnees peuvent s'appliquer. Nous ne vendons pas vos renseignements personnels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Garantie de satisfaction</h2>
              <p>
                Si vous n'etes pas satisfait d'un service, contactez-nous dans un delai raisonnable et nous examinerons la situation
                afin de trouver une solution appropriee avec vous.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Limitation de responsabilite</h2>
              <p>
                Dans toute la mesure permise par la loi, Ca-Ca Canin n'est pas responsable des dommages indirects, accessoires, particuliers
                ou consecutifs. Notre responsabilite totale pour toute reclamation liee a un service ou a l'utilisation du site web ne depassera
                pas le montant que vous nous avez paye pour le service ayant donne lieu a la reclamation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Disponibilite du site web</h2>
              <p>
                Ce site web est fourni <span className="font-semibold">tel quel</span> et <span className="font-semibold">selon la disponibilite</span>.
                Nous ne garantissons pas un acces ininterrompu, un fonctionnement sans erreur ni que toute l'information sera toujours a jour.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Droit applicable</h2>
              <p>
                Les presentes conditions sont regies par les lois du Quebec et les lois du Canada applicables au Quebec.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Coordonnees</h2>
              <p>Si vous avez des questions au sujet de ces conditions, contactez Ca-Ca Canin :</p>
              <p>Telephone : 438 880 8922</p>
              <p>Courriel : cacacaninqc@gmail.com</p>
              <p>Laval, QC</p>
            </section>
          </div>
        </div>
      </main>
    </LegalPageShell>
  );
}
