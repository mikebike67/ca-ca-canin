import Link from "next/link";
import LegalPageShell from "@/components/legal-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite | Ca-Ca Canin",
  description: "Consultez la politique de confidentialite de Ca-Ca Canin pour les services de ramassage de dejections canines et de nettoyage printanier.",
  alternates: {
    canonical: "/fr/privacy",
    languages: {
      en: "/privacy",
      fr: "/fr/privacy",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Politique de confidentialite | Ca-Ca Canin",
    description: "Consultez la politique de confidentialite de Ca-Ca Canin pour les services de ramassage de dejections canines et de nettoyage printanier.",
    url: "https://cacacanin.com/fr/privacy",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    type: "website",
  },
};

export default function FrenchPrivacyPage() {
  return (
    <LegalPageShell locale="fr">
      <div className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <div className="mb-10 border-b border-[#d7e6da] pb-6">
            <Link href="/fr" className="text-sm font-semibold text-[#307944] hover:underline">
              Retour a l'accueil
            </Link>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Politique de confidentialite
            </h1>
            <p className="mt-3 text-base text-gray-600">Derniere mise a jour : 1 mars 2026</p>
          </div>

          <div className="space-y-10 text-gray-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Renseignements recueillis</h2>
              <p>
                Nous pouvons recueillir votre nom, votre adresse courriel, votre numero de telephone, votre code postal,
                les details du service demande et tout autre renseignement que vous soumettez lorsque vous nous contactez ou demandez un devis.
                Si des outils d'analyse sont actives, nous pouvons aussi recueillir des donnees de base sur l'utilisation du site,
                comme le type d'appareil, les pages consultees et l'activite generale de visite.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Utilisation de vos renseignements</h2>
              <p>
                Nous utilisons vos renseignements pour fournir des devis, planifier et offrir le service, envoyer des mises a jour,
                repondre aux questions, soutenir la clientele, traiter les paiements lorsque necessaire et ameliorer le site web
                ainsi que les operations du service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Consentement et SMS</h2>
              <p>
                Lorsque vous soumettez un formulaire et cochez la case de consentement, vous acceptez que Ca-Ca Canin puisse vous contacter par appel,
                message texte et courriel au sujet de votre demande, de la planification et des mises a jour de service. Si la messagerie texte est utilisee,
                vous pouvez vous desabonner en repondant <span className="font-semibold">STOP</span>. Des frais de messagerie et de donnees peuvent s'appliquer.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Temoins et analyse</h2>
              <p>
                Nous pouvons utiliser des temoins ou outils semblables pour memoriser les preferences du site, comprendre son utilisation et en ameliorer
                la performance. Vous pouvez gerer les temoins dans les parametres de votre navigateur, y compris les bloquer ou les supprimer.
                Certaines fonctionnalites du site pourraient ne pas fonctionner comme prevu si les temoins sont desactives.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Partage des renseignements</h2>
              <p>
                Nous pouvons partager des renseignements avec des fournisseurs de services qui nous aident a exploiter le site web ou les outils de communication,
                y compris les fournisseurs de courriel, SMS, analyse, paiement, hebergement ou planification. Nous pouvons aussi divulguer des renseignements
                lorsque la loi l'exige ou lorsque cela est necessaire pour proteger nos droits. Nous ne vendons pas les renseignements personnels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Conservation</h2>
              <p>
                Nous conservons les renseignements personnels seulement pendant la periode raisonnablement necessaire aux fins decrites dans cette politique,
                notamment pour le service a la clientele, les exigences juridiques, comptables et de tenue de dossiers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Securite</h2>
              <p>
                Nous utilisons des mesures administratives, techniques et organisationnelles raisonnables pour proteger les renseignements personnels.
                Aucun systeme n'est entierement securise, donc une securite absolue ne peut pas etre garantie.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Responsable de la confidentialite</h2>
              <p>
                Pour les obligations de transparence de la Loi 25 et pour toute question en matiere de confidentialite,
                contactez la personne responsable de la protection des renseignements personnels :
              </p>
              <p>Courriel : cacacaninqc@gmail.com</p>
              <p>Telephone : 438 880 8922</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Vos droits</h2>
              <p>
                Sous reserve de la loi applicable, vous pouvez demander l'acces a vos renseignements personnels, demander des corrections
                ou demander leur suppression. Pour faire une demande, utilisez les coordonnees indiquees sur cette page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Enfants</h2>
              <p>
                Notre site web et nos services ne sont pas destines aux enfants, et nous ne recueillons pas sciemment de renseignements
                personnels aupres d'enfants.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Mises a jour de la politique</h2>
              <p>
                Nous pouvons mettre a jour cette politique de confidentialite a l'occasion. Toute mise a jour sera publiee sur cette page
                avec une date de derniere mise a jour revisee.
              </p>
            </section>
          </div>
        </div>
      </div>
    </LegalPageShell>
  );
}
