'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import RegularServiceCalculator from "@/components/regular-service-calculator"
import BeforeAfterGallery from "@/components/before-after-gallery"
import { REGULAR_SERVICE_LOCATIONS } from "@/lib/regular-service-area"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Montserrat } from 'next/font/google'
import { CheckCircle2, Heart, Camera, Bell, ClipboardCheck, MapPin, PawPrint, Smartphone } from 'lucide-react'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
})

export default function RamassageDejectionsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const faqItems = [
    {
      q: "Combien coûte le service régulier de ramassage?",
      a: "Le service hebdomadaire commence à 20 $/visite pour un chien dans une cour standard. Le prix varie selon le nombre de chiens, la taille de la cour et la fréquence. Utilisez le calculateur ci-dessus pour voir votre estimation.",
    },
    {
      q: "Dois-je signer un contrat?",
      a: "Aucun contrat requis. Vous pouvez demander le service et ajuster ou annuler à tout moment.",
    },
    {
      q: "Dois-je être sur place?",
      a: "Non. Si nous avons accès au portail, nous pouvons effectuer la visite et envoyer une confirmation ensuite.",
    },
    {
      q: "Comment confirmez-vous la zone desservie?",
      a: "Chaque demande est validée avec le code postal avant la réservation afin de confirmer la disponibilité.",
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
    <div lang="fr" className={`flex flex-col min-h-screen bg-white text-gray-900 ${montserrat.className}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 1.5rem;
        }
        main[id], main [id] {
          scroll-margin-top: 1.5rem;
        }
        :root {
          --brand-green: #307944;
          --brand-green-dark: #307944;
          --brand-brown: #724420;
        }
        .scroll-animation {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .scroll-animation.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
          <div className="flex items-center justify-between h-16">
            <Link href="/fr" className="flex min-w-0 items-center space-x-3">
              <Image
                src="/images/cacacaninlogo.jpg"
                alt="Logo Ca-Ca Canin"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className={`text-lg font-bold text-brand-green sm:text-2xl ${montserrat.className}`}>
                CA-CA CANIN
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-700 hover:text-brand-green transition-colors">Comment ça fonctionne</Link>
              <Link href="#quote-form" className="text-gray-700 hover:text-brand-green transition-colors">Tarifs</Link>
              <Link href="#faq" className="text-gray-700 hover:text-brand-green transition-colors">FAQ</Link>
              <Link href="/fr/contact" className="text-gray-700 hover:text-brand-green transition-colors">Contact</Link>
              <Link href="/dog-poop-cleanup" className="text-brand-brown hover:text-brand-brown/80 transition-colors">English</Link>
              <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form">Obtenir un devis gratuit</Link>
              </Button>
            </div>

            <button
              className="md:hidden rounded-lg p-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Basculer le menu de navigation"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div id="mobile-nav" className="space-y-2 border-t border-gray-200 py-4 md:hidden">
              <Link href="#how-it-works" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Comment ça fonctionne</Link>
              <Link href="#quote-form" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Tarifs</Link>
              <Link href="#faq" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">FAQ</Link>
              <Link href="/fr/contact" className="block rounded-md py-2 text-gray-700 hover:text-brand-green">Contact</Link>
              <Link href="/dog-poop-cleanup" className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80">English</Link>
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
                <Link href="#quote-form">Obtenir un devis gratuit</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main id="main-content" className="flex-grow scroll-mt-12 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  name: "Ramassage régulier de déjections canines",
                  serviceType: "Ramassage de déjections canines",
                  provider: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: "https://cacacanin.com/fr/ramassage-dejections",
                  },
                  areaServed: [
                    "Laval, QC",
                    "Blainville, QC",
                    "Bois-des-Filion, QC",
                    "Boisbriand, QC",
                    "Deux-Montagnes, QC",
                    "Lorraine, QC",
                    "Mirabel, QC",
                    "Oka, QC",
                    "Pointe-Calumet, QC",
                    "Rosemere, QC",
                    "Saint-Eustache, QC",
                    "Saint-Joseph-du-Lac, QC",
                    "Sainte-Anne-des-Plaines, QC",
                    "Sainte-Marthe-sur-le-Lac, QC",
                    "Sainte-Therese, QC",
                  ],
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

        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-brown font-semibold mb-3">
              Laval et Rive-Nord, QC
            </p>
            <h1 className={`mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl ${montserrat.className}`}>
              RAMASSAGE DE DÉJECTIONS CANINES À LAVAL ET SUR LA RIVE-NORD
            </h1>
            <p className="mb-6 text-lg text-gray-600 sm:text-xl md:text-2xl">
              Ne vous occupez plus jamais des déjections dans la cour. Service régulier à partir de 20 $/visite — hebdomadaire, aux deux semaines ou mensuel.
            </p>
            <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
              <Button size="lg" className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#quote-form">Obtenir mon devis gratuit</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full border-2 border-brand-brown bg-brand-brown px-6 py-4 text-base text-white hover:bg-brand-brown/90 hover:text-white sm:w-auto sm:px-8 sm:py-5 sm:text-lg" asChild>
                <Link href="#how-it-works">Comment ça fonctionne</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-green">
              Les places sur les routes sont limitées. La plupart des demandes sont confirmées en 1 jour ouvrable lorsqu&apos;une place est disponible.
            </p>
            <ul className="mt-8 grid gap-3 text-left max-w-2xl mx-auto text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Service hebdomadaire, aux deux semaines, mensuel ou ponctuel
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Tarification claire selon la fréquence, le nombre de chiens et la taille du terrain
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green mt-0.5" />
                Confirmation rapide dans les villes desservies
              </li>
            </ul>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                "À partir de 20 $/visite",
                "Aucun contrat requis",
                "Confirmation après chaque visite",
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

        <section id="quote-form" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <RegularServiceCalculator locale="fr" />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Comment ça fonctionne
              </h2>
              <p className="text-lg text-gray-600">
                Configuration simple, nettoyage régulier, sans effort de votre part.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Demander un devis", desc: "Indiquez la fréquence, la taille de la cour, le nombre de chiens et votre code postal." },
                { icon: PawPrint, title: "Choisir l'horaire", desc: "Nous confirmons votre zone de service et validons la meilleure fréquence pour votre cour." },
                { icon: Smartphone, title: "On garde la cour propre", desc: "Une fois réservé, le service suit la fréquence choisie pour éviter l'accumulation." },
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

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Ce que disent nos clients
              </h2>
              <p className="text-lg text-gray-600">
                Avis réels de propriétaires de chiens à Laval et sur la Rive-Nord.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 etoiles
                  </div>
                  <CardTitle className="text-xl">Zander M. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn&apos;t see the ground, they hadn&apos;t cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn&apos;t have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN 💪💯
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis Google
                  </div>
                  <CardTitle className="text-xl">Julie B. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael&apos;s attention to detail is one of his best attributes. He did a thorough job of cleaning up all the doggy poop from this past winter. His attitude is professional, efficient and personable. As a dog owner himself, he understands how much we love our fur babies AND keeping our environment clean. I highly recommend his services, and I will use him again.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Avis 5 etoiles
                  </div>
                  <CardTitle className="text-xl">Daniella H. | Deux-Montagnes</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Michael is fantastic! Super professional, clean, and his customer service is 100%. We hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can&apos;t recommend him enough!
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
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
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Recommandation Facebook
                  </div>
                  <CardTitle className="text-xl">Elisa A. | Laval</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    I recently had the pleasure of hiring a young entrepreneur who runs a dog waste removal service, and I couldn&apos;t be more impressed. He arrived right on time, was extremely professional, and got straight to work. Not only did he do a thorough and efficient job, but he also paid attention to detail and left my yard looking spotless. It&apos;s clear he takes pride in his work and is serious about his business. It&apos;s always great to support someone who is motivated and dependable, and he absolutely delivered on both. I would highly recommend Michael&apos;s services to anyone looking for a reliable and hassle-free solution for keeping their yard clean. Thank you !!!
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] lg:col-span-2">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Recommandation Facebook
                  </div>
                  <CardTitle className="text-xl">Pete B. | Lorraine</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Very professional job. Winter snow just melted to reveal all of the winter&apos;s poop. Thankfully I was given Michael&apos;s number. He came super fast with all his equipment and in no time my yard was spotless.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
                <CardHeader>
                  <div className="mb-3 inline-flex max-w-fit rounded-full border border-brand-green/20 bg-[#eef7f0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                    Recommandation Facebook
                  </div>
                  <CardTitle className="text-xl">Sylvain D. | Mirabel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="break-words text-base leading-8 text-gray-600">
                    Excellent travail! Je recommande fortement!
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <BeforeAfterGallery locale="fr" />

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Pourquoi réserver le service régulier
              </h2>
              <p className="text-lg text-gray-600">
                La plupart des demandes de devis sont traitées rapidement et le service régulier se confirme habituellement en 1 jour ouvrable lorsqu&apos;une place est disponible.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: "Moins de corvées", desc: "Le service régulier enlève une tâche sale de votre semaine pour de bon." },
                { icon: Camera, title: "Confirmation après la visite", desc: "Nous envoyons une confirmation après chaque passage effectué." },
                { icon: Bell, title: "Fréquence flexible", desc: "Choisissez une visite hebdomadaire, aux deux semaines, mensuelle ou ponctuelle." },
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

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Zone desservie
              </h2>
              <p className="text-lg text-gray-600">
                Service à Laval et dans certaines villes de la Rive-Nord : Blainville, Boisbriand, Bois-des-Filion, Deux-Montagnes, Lorraine, Mirabel, Oka, Pointe-Calumet, Rosemère, Saint-Eustache, Saint-Joseph-du-Lac, Sainte-Anne-des-Plaines, Sainte-Marthe-sur-le-Lac et Sainte-Thérèse.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {REGULAR_SERVICE_LOCATIONS.map((location) => (
                <Link key={location.slug} href={`/fr/ramassage-dejections/${location.slug}`} className="block h-full">
                  <Card className="h-full border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                    <CardHeader className="items-center text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-brand-green/15 bg-[#eef7f0]">
                        <MapPin className="h-7 w-7 text-brand-green" />
                      </div>
                      <CardTitle className="text-xl">{location.nameFr}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
                Questions fréquentes
              </h2>
              <p className="text-lg text-gray-600">
                Réponses sur la fréquence, la tarification et la zone desservie.
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
      </main>

      <SiteFooter locale="fr" />
    </div>
  )
}
