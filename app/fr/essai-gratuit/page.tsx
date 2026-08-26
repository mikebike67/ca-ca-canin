'use client'

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import dynamic from "next/dynamic"
import { CheckCircle2, MessageSquareHeart, CalendarClock, Camera, Bell } from "lucide-react"

const FreeTrialSignup = dynamic(() => import("@/components/free-trial-signup"), { ssr: false })
const TestimonialsCarousel = dynamic(() => import("@/components/testimonials-carousel"), { ssr: false })

export default function EssaiGratuitPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in")
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )
    document.querySelectorAll(".scroll-animation").forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <SiteHeader
        locale="fr"
        altHref="/free-trial"
        ctaLabel="Réserver ma place"
        ctaHref="#signup"
      />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">

        {/* Hero */}
        <section className="bg-white px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-5">
              Seulement 10 places disponibles
            </span>
            <h1 className="mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              2 semaines de nettoyage,<br />
              <span className="text-brand-green">gratuites</span>
            </h1>
            <p className="mb-8 text-base text-gray-600 sm:text-xl md:text-2xl">
              Nous choisissons 10 propriétaires à Laval et sur la Rive-Nord pour un essai gratuit de 2 semaines, 1 visite par semaine, sans frais. En échange, on vous demande simplement vos commentaires honnêtes.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#signup"
                data-cta="hero-signup"
                className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg inline-flex items-center justify-center font-semibold transition-colors"
              >
                Réserver ma place
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              Aucun frais. Aucune obligation. Juste votre cour, propre, pendant 2 semaines.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green" />
                Sans contrat
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-brand-green" />
                Photo de la cour envoyée
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-green" />
                Texto avant l&rsquo;arrivée
              </div>
            </div>
          </div>
        </section>

        {/* Signup form */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Réservez l&rsquo;une des 10 places gratuites
              </h2>
              <p className="text-gray-500">Dites-nous où passer et on confirme votre première visite.</p>
            </div>
            <FreeTrialSignup locale="fr" />
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Comment fonctionne l&rsquo;essai</h2>
              <p className="text-xl text-gray-600">Trois étapes, deux semaines, aucun coût.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: MessageSquareHeart, title: "1. Inscrivez-vous", desc: "Remplissez vos informations ci-dessous. On confirme votre place et la date de votre première visite." },
                { icon: CalendarClock, title: "2. On visite chaque semaine", desc: "Un nettoyage complet de la cour, une fois par semaine, pendant 2 semaines, entièrement gratuit." },
                { icon: CheckCircle2, title: "3. Partagez vos commentaires", desc: "Dites-nous honnêtement comment ça s'est passé. Aucune obligation de continuer après l'essai." },
              ].map((step, index) => (
                <Card key={step.title} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
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

        {/* Reviews */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ce que disent nos clients actuels</h2>
            </div>
            <TestimonialsCarousel locale="fr" />
          </div>
        </section>

        {/* FAQ */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Questions sur l&rsquo;essai</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Est-ce que ça coûte vraiment quelque chose?", a: "Non. L'essai comprend 2 visites complètes, 1 par semaine pendant 2 semaines, sans frais pour les 10 foyers sélectionnés." },
                { q: "Dois-je continuer après l'essai?", a: "Non. Il n'y a aucune obligation de s'abonner au service payant par la suite. On demande simplement vos commentaires honnêtes, peu importe votre décision." },
                { q: "Quelle est la zone desservie?", a: "Laval et les municipalités de la Rive-Nord que nous desservons déjà. Si vous êtes hors zone, on vous le dira." },
                { q: "Quel genre de commentaires avez-vous besoin?", a: "Simplement votre expérience honnête : ce qui a bien fonctionné, ce qui pourrait être amélioré, et si vous nous recommanderiez. Un court avis nous aide énormément." },
                { q: "Combien de places reste-t-il?", a: "Le compteur au-dessus du formulaire se met à jour en temps réel. Une fois les 10 places prises, les nouvelles inscriptions rejoignent une liste d'attente." },
              ].map((faq) => (
                <Card key={faq.q} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]">
                  <CardHeader><CardTitle className="text-lg">{faq.q}</CardTitle></CardHeader>
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
