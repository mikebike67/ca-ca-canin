'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useEffect, useRef } from "react"
import { CheckCircle2, Heart, Camera, Bell, ClipboardCheck, Tag, Sparkles } from 'lucide-react'
import SiteHeader from "@/components/site-header"

const RegularServiceCalculator = dynamic(() => import('@/components/regular-service-calculator'), { ssr: false })
const BeforeAfterGallery = dynamic(() => import('@/components/before-after-gallery'), { ssr: false })

export default function PrintempsEnServicePage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const faqItems = [
    {
      q: "Qui est admissible au 50 % de rabais sur le premier nettoyage ?",
      a: "Tout nouveau client qui s'inscrit à au moins un mois de service récurrent (hebdomadaire, aux deux semaines ou mensuel) est admissible au premier nettoyage à prix réduit.",
    },
    {
      q: "Quel est le prix réduit ?",
      a: "Votre premier nettoyage est à 30 $ pour les 30 premières minutes (régulièrement 60 $), puis 2,50 $ par tranche supplémentaire de 5 minutes (régulièrement 5 $). Le rabais de 50 % s'applique à l'ensemble du nettoyage.",
    },
    {
      q: "Dois-je signer un contrat ?",
      a: "Aucun contrat requis. Vous vous engagez à un minimum d'un mois de service récurrent pour bénéficier de la promotion, mais aucune obligation à long terme au-delà de cela.",
    },
    {
      q: "Quand l'offre expire-t-elle ?",
      a: "La promotion Printemps en Service est valide jusqu'au 20 juin 2026. Les demandes doivent être soumises avant cette date.",
    },
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.scroll-animation').forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div lang="fr" className="flex flex-col min-h-screen bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <SiteHeader locale="fr" altHref="/spring-into-service" ctaLabel="Réclamer 50 % de rabais" ctaHref="#calculator" showAnnouncement={false} />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: "Printemps en Service — Promo ramassage déjections canines",
                  serviceType: "Ramassage de déjections canines",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: "https://cacacanin.com/fr/printemps-en-service",
                  },
                  areaServed: [
                    "Laval, QC",
                    "Blainville, QC",
                    "Bois-des-Filion, QC",
                    "Boisbriand, QC",
                    "Deux-Montagnes, QC",
                    "Lorraine, QC",
                    "Mirabel, QC",
                    "Rosemère, QC",
                    "Saint-Eustache, QC",
                    "Sainte-Thérèse, QC",
                  ],
                },
                {
                  "@type": "Offer",
                  name: "50 % de rabais sur le premier nettoyage de déjections canines",
                  description: "50 % de rabais sur le premier nettoyage lors de l'inscription à un service récurrent de ramassage de déjections canines.",
                  price: "30",
                  priceCurrency: "CAD",
                  validThrough: "2026-06-20",
                  seller: { "@type": "LocalBusiness", name: "Ca-Ca Canin" },
                },
                {
                  "@type": "FAQPage",
                  mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.a,
                    },
                  })),
                },
              ],
            }),
          }}
        />

        {/* Section héro */}
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              Offre à durée limitée · Valide jusqu'au 20 juin 2026
            </div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl">
              Printemps en Service
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl md:text-2xl">
              Inscrivez-vous au service hebdomadaire, aux deux semaines ou mensuel, et votre premier nettoyage passe de 60 $ à 30 $. Aucun contrat requis.
            </p>
            <div className="mb-6 flex items-baseline justify-center gap-3">
              <span className="text-3xl font-semibold text-gray-400 line-through">60 $</span>
              <span className="text-6xl font-extrabold text-brand-green">30 $</span>
              <span className="text-lg text-gray-500">nettoyage initial</span>
            </div>
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#calculator">Réclamer mon 50 % de rabais</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">Comment ça fonctionne</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">
              Offre valide jusqu'au 20 juin 2026. Engagement minimum d'un mois de service récurrent requis.
            </p>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                "50 % de rabais sur le premier nettoyage",
                "Aucun contrat requis",
                "À partir de 20 $/visite ensuite",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça fonctionne */}
        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Comment ça fonctionne
              </h2>
              <p className="text-lg text-gray-600">
                Trois étapes simples pour une cour propre toute la saison.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Utilisez la calculatrice", desc: "Obtenez votre estimation de prix instantanée ci-dessous. Sélectionnez hebdomadaire, aux deux semaines ou mensuel pour accéder à la promo." },
                { icon: Tag, title: "Inscrivez-vous au service récurrent", desc: "Choisissez votre fréquence et engagez-vous à au moins un mois de service récurrent." },
                { icon: Sparkles, title: "Premier nettoyage à 50 % de rabais", desc: "Votre première visite passe de 60 $ à 30 $. Nous nous occupons du reste selon votre horaire." },
              ].map((step, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <step.icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{step.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi Ca-Ca Canin */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Pourquoi Ca-Ca Canin
              </h2>
              <p className="text-lg text-gray-600">
                Service local à Laval qui se présente de façon fiable pour que votre cour reste propre toute la saison.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: "Moins de corvées chaque semaine", desc: "Le nettoyage récurrent élimine définitivement cette tâche salissante de votre horaire." },
                { icon: Camera, title: "Confirmation de visite", desc: "Nous envoyons une confirmation après chaque visite complétée pour que vous le sachiez toujours." },
                { icon: Bell, title: "Fréquence flexible", desc: "Hebdomadaire, aux deux semaines ou mensuel. Ajustez votre horaire en tout temps." },
              ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <feature.icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Avis clients */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Ce que disent nos clients
              </h2>
              <p className="text-lg text-gray-600">
                Vrais avis de propriétaires de chiens dans Laval et la Rive-Nord.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 étoiles
                  </div>
                  <CardTitle className="text-xl">Zander M. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn, which let me tell you was a doozy and a half to say the least. Micheal came out and meticulously lifted everything and got most of the turd mines. For 80$ I couldn&apos;t have spent my money more wisely, I recommend Micheal to everyone who owns a dog and needs some help with their yard. KEEP IT UP MAN 💪💯
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 étoiles
                  </div>
                  <CardTitle className="text-xl">Julie B. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael&apos;s attention to detail is one of his best attributes. He did a thorough job of cleaning up all the doggy poop from this past winter. His attitude is professional, efficient and personable. I highly recommend his services, and I will use him again.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 étoiles
                  </div>
                  <CardTitle className="text-xl">Daniella H. | Deux-Montagnes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael is fantastic! Super professional, clean, and his customer service is 100%. We hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can&apos;t recommend him enough!
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 étoiles
                  </div>
                  <CardTitle className="text-xl">Mohamed L. | Boisbriand</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Service impeccable de Ca-Ca Canin. Rapide, professionnel et ma cour est redevenue parfaitement propre après leur passage. Ça enlève vraiment une grosse corvée quand on a un chien. Le prix est très raisonnable et le travail est très bien fait. Je recommande sans hésiter à tous les propriétaires de chiens. Service 5 étoiles.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <BeforeAfterGallery locale="fr" />

        {/* Détails de l'offre */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#eef7f0]">
          <div className="max-w-3xl mx-auto text-center scroll-animation">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">Détails de l'offre</p>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Ce qui est inclus</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Premier nettoyage : 30 $ pour les 30 premières minutes (régulièrement 60 $), puis 2,50 $ par tranche de 5 minutes supplémentaires (régulièrement 5 $). Le rabais de 50 % s'applique à l'ensemble du nettoyage. Valide avec un engagement de service récurrent d'au moins 1 mois. Offre valide jusqu'au 20 juin 2026. Ne peut être combinée avec d'autres promotions. Ca-Ca Canin se réserve le droit de mettre fin à la promotion avant cette date.
            </p>
            <ul className="mt-6 grid gap-3 text-left text-sm max-w-lg mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                30 premières minutes à 30 $ (50 % de rabais sur le tarif habituel de 60 $)
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                +2,50 $ par tranche de 5 minutes supplémentaires (régulièrement 5 $) si la cour nécessite plus de temps
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                Inscription à au moins 1 mois de service récurrent requise
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5 shrink-0" />
                Valide jusqu'au 20 juin 2026
              </li>
            </ul>
          </div>
        </section>

        {/* Calculatrice */}
        <section id="calculator" className="scroll-mt-16 py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Obtenez votre prix et profitez de votre 50 % de rabais
              </h2>
              <p className="text-lg text-gray-600">
                Choisissez hebdomadaire, aux deux semaines ou mensuel pour bénéficier du 50 % de rabais sur le premier nettoyage.
              </p>
            </div>
            <div className="scroll-animation">
              <RegularServiceCalculator locale="fr" />
            </div>
          </div>
        </section>

        {/* Foire aux questions */}
        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Foire aux questions
              </h2>
              <p className="text-lg text-gray-600">
                Tout ce que vous devez savoir sur l'offre Printemps en Service.
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">{faq.a}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Lien vers le service régulier */}
        <section className="bg-[#eef7f0] px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">Service régulier</p>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Gardez la cour propre toute l'année</h2>
            <p className="mb-6 text-gray-600">
              Après votre première visite à prix réduit, le service récurrent continue aux tarifs standards à partir de 20 $/visite.
            </p>
            <Link
              href="/fr/ramassage-dejections"
              className="inline-flex items-center rounded-full bg-brand-green px-7 py-3 font-semibold text-white hover:bg-brand-green-dark transition-colors"
            >
              Voir le service régulier →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale="fr" />
    </div>
  )
}
