'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText } from "lucide-react"

const FreeCleanupCalculator = dynamic(() => import("@/components/free-cleanup-calculator"), { ssr: false })
const TestimonialsCarousel = dynamic(() => import("@/components/testimonials-carousel"), { ssr: false })

export default function PremierNettoyageGratuitPage() {
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
    <div lang="fr" className="flex flex-col min-h-screen bg-white text-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <SiteHeader
        locale="fr"
        altHref="/free-cleanup"
        ctaLabel="Obtenir mon nettoyage gratuit"
        ctaHref="#calculateur"
      />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">

        {/* Hero */}
        <section className="bg-white px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-5">
              Offre limitée · Expire le 30 septembre 2026
            </span>
            <h1 className="mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              Votre premier nettoyage<br />
              <span className="text-brand-green">est gratuit</span>
            </h1>
            <p className="mb-8 text-base text-gray-600 sm:text-xl md:text-2xl">
              Inscrivez-vous à un service récurrent hebdomadaire ou bihebdomadaire et on fait votre premier nettoyage de cour gratuitement.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                asChild
              >
                <Link href="#calculateur" data-cta="hero-quote">Obtenir mon nettoyage gratuit</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              Aucun contrat. Devis rapide. Cour propre.
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-green">
              La plupart des demandes sont confirmées en 1 jour ouvrable.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green" />
                Aucun contrat
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-brand-green" />
                Photo du portail après chaque visite
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-green" />
                Textos avant l&rsquo;arrivée
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto">
              {[
                "Service Laval et Rive-Nord",
                "Réponse habituelle en 1 jour ouvrable",
                "Photo du portail après la visite",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 text-sm font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculateur" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Voyez votre prix et réclamez votre visite gratuite
              </h2>
              <p className="text-gray-500">
                Remplissez vos coordonnées et nous vous répondrons dans 1 jour ouvrable.
              </p>
            </div>
            <FreeCleanupCalculator locale="fr" />
          </div>
        </section>

        {/* Customer Promise */}
        <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-0 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Ce que vous évitez avec un service régulier
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              <Card className="scroll-animation scroll-delay-1 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <CheckCircle2 className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Finis les dégâts dans la cour</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Vous n&rsquo;avez plus à vérifier la cour avant chaque sortie du chien ni à penser au nettoyage en rentrant.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation scroll-delay-2 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Shield className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Service simple et rapide</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Demandez un devis, recevez une réponse rapide et commencez sans contrat à long terme.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="scroll-animation scroll-delay-3 border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                    <Heart className="w-6 h-6 text-brand-green" />
                  </div>
                  <CardTitle className="text-xl">Une cour qu&rsquo;on a envie d&rsquo;utiliser</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-gray-600">
                    Votre cour sent meilleur, paraît plus propre et redevient un espace agréable pour la famille.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <TestimonialsCarousel locale="fr" />
          </div>
        </section>

        {/* About */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Pourquoi les propriétaires nous appellent
                </h2>
                <Image
                  src="/images/our dog waste renewal company.png"
                  alt="Équipe Ca-Ca Canin dans une cour résidentielle avec outils de nettoyage et camion de service"
                  width={1200}
                  height={900}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 0px"
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                />
                <p className="text-lg text-gray-700 mb-4">
                  Ca-Ca Canin est pour les propriétaires de Laval et de la Rive-Nord qui en ont assez de l&rsquo;odeur, du désordre et du temps perdu à tout nettoyer eux-mêmes.
                </p>
                <p className="text-lg text-gray-700">
                  Vous obtenez une équipe locale, des tarifs clairs et un service simple qui garde la cour prête pour les enfants, les invités et la vraie vie.
                </p>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-2 md:block">
                <Image
                  src="/images/our dog waste renewal company.png"
                  alt="Équipe Ca-Ca Canin dans une cour résidentielle avec outils de nettoyage et camion de service"
                  width={1200}
                  height={900}
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Residential Services */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Gardez votre cour propre sans le faire vous-même
                </h2>
                <Image
                  src="/images/revised residential pooper scooper services.png"
                  alt="Équipe de ramassage résidentiel en train de nettoyer une cour avec un chien à proximité"
                  width={1200}
                  height={900}
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 0px"
                  className="mb-6 rounded-lg shadow-lg w-full md:hidden"
                />
                <ul className="space-y-4 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Choisissez la fréquence qui empêche la saleté de s&rsquo;accumuler.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Nous nettoyons les zones que votre chien utilise le plus, sans que vous ayez à y penser.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green mr-3 flex-shrink-0 mt-1" />
                    <span>Réservez un service ponctuel ou récurrent avec une entreprise locale qui se présente vraiment.</span>
                  </li>
                </ul>
              </div>
              <div className="scroll-animation scroll-delay-1 order-1 hidden md:order-1 md:block">
                <Image
                  src="/images/revised residential pooper scooper services.png"
                  alt="Équipe de ramassage résidentiel en train de nettoyer une cour avec un chien à proximité"
                  width={1200}
                  height={900}
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Pourquoi les propriétaires restent avec nous
              </h2>
              <p className="text-xl text-gray-600">
                Pensé pour les propriétaires qui veulent enlever l&rsquo;odeur, le désordre et une corvée de plus.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: Heart,      title: "Pensé pour les familles occupées",  desc: "Nous nettoyons avec soin pour que la cour redevienne prête pour les enfants, les chiens et les invités." },
                { icon: Smartphone, title: "Réponse rapide et locale",           desc: "Demandez un devis, réservez le service et obtenez des réponses sans attendre inutilement." },
                { icon: FileText,   title: "Sans engagement",                    desc: "Commencez quand vous en avez besoin et arrêtez quand ce n'est plus utile." },
                { icon: Camera,     title: "Photos du portail",                  desc: "Vous voyez la preuve après chaque visite pour savoir que le travail a été fait." },
                { icon: Bell,       title: "Mises à jour de visite",             desc: "Vous savez quand nous arrivons, sans vous demander où on en est." },
              ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
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

        {/* FAQ */}
        <section className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Questions que les propriétaires posent avant de réserver
              </h2>
              <p className="text-xl text-gray-600">
                Réponses claires sur les prix, la planification et ce qui se passe après la réservation.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Comment fonctionne le premier nettoyage gratuit?", a: "Quand vous vous inscrivez à un service récurrent hebdomadaire ou aux deux semaines, votre premier nettoyage est entièrement gratuit. Aucuns frais cachés. Inscrivez-vous, confirmez votre horaire, et on fait la première visite sans frais." },
                { q: "Nettoyez-vous toute la cour?", a: "Oui. Nous nettoyons les zones de la propriété où il y a des déjections, y compris l'avant, l'arrière, les côtés et les espaces comme les enclos à chiens." },
                { q: "Offrez-vous le service toute l'année?", a: "Oui. Ca-Ca Canin offre le service toute l'année à Laval et dans les villes desservies de la Rive-Nord, y compris en hiver lorsque le nettoyage demeure accessible." },
                { q: "Comment le prix est-il calculé?", a: "Le prix dépend de la taille de la cour, de la fréquence du service et du nombre de chiens. Utilisez le calculateur ci-dessus pour une estimation, puis demandez un devis pour le prix final." },
                { q: "Dois-je signer un contrat?", a: "Non. Vous pouvez commencer, mettre en pause ou annuler le service en communiquant avec notre équipe." },
                { q: "Que se passe-t-il après chaque visite?", a: "Vous recevez une confirmation de service et, au besoin, une photo du portail après la visite." },
              ].map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
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
