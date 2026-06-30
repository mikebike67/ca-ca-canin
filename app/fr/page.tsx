'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SiteFooter from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import { useEffect, useRef } from "react"
import { CheckCircle2, Shield, Heart, Bell, Camera, Smartphone, FileText } from 'lucide-react'
import SiteHeader from "@/components/site-header"

const RegularServiceCalculator = dynamic(() => import('@/components/regular-service-calculator'), { ssr: false })
const BeforeAfterGallery = dynamic(() => import('@/components/before-after-gallery'), { ssr: false })
const ServiceAreaMap = dynamic(() => import('@/components/service-area-map'), { ssr: false })
const TestimonialsCarousel = dynamic(() => import('@/components/testimonials-carousel'), { ssr: false })

export default function Page() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    <div lang="fr" className={`flex flex-col min-h-screen bg-white text-gray-900`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-brand-brown shadow"
      >
        Passer au contenu
      </a>
      <SiteHeader locale="fr" altHref="/" ctaLabel="Vérifier ma disponibilité" />

      <main id="main-content" className="flex-grow scroll-mt-12 pt-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": "https://cacacanin.com/#business",
                  name: "Ca-Ca Canin",
                  url: "https://cacacanin.com/fr",
                  image: "https://cacacanin.com/images/cacacaninlogo.jpg",
                  logo: "https://cacacanin.com/images/cacacaninlogo.jpg",
                  description: "Service de ramassage de dejections canines a Laval et dans certaines villes de la Rive-Nord, Quebec.",
                  areaServed: [
                    { "@type": "City", name: "Laval" },
                    { "@type": "AdministrativeArea", name: "Rive-Nord, QC" }
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Laval",
                    addressRegion: "QC",
                    addressCountry: "CA"
                  },
                  telephone: "+1-438-880-8922",
                  email: "cacacaninqc@gmail.com",
                  priceRange: "$$"
                },
                {
                  "@type": "Service",
                  serviceType: "Ramassage de dejections canines",
                  provider: {
                    "@id": "https://cacacanin.com/#business"
                  },
                  areaServed: [
                    {
                      "@type": "City",
                      name: "Laval"
                    },
                    {
                      "@type": "AdministrativeArea",
                      name: "Rive-Nord, QC"
                    }
                  ],
                  offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/InStock"
                  }
                }
              ]
            })
          }}
        />
        {/* Hero Section */}
        {/* RESPONSIVE: reduce hero density on phones while preserving the desktop art/text composition. */}
        <section className="bg-white px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1fr)] lg:gap-10">
              {/* RESPONSIVE: hide the decorative hero image on smaller screens to keep the mobile hero compact and focused on the CTA. */}
              <div className="hidden justify-center lg:flex lg:justify-start">
                <div className="relative w-full max-w-[23rem] overflow-hidden sm:max-w-[30rem] lg:max-w-[38rem]">
                  <div className="absolute inset-x-8 bottom-8 h-12 rounded-full bg-brand-brown/15 blur-3xl sm:inset-x-10 sm:bottom-10 sm:h-14 lg:inset-x-12" />
                  <Image
                    src="/images/hero-dog.png"
                    alt="Chien heureux assis dans une cour propre"
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 34rem, 0px"
                    className="relative z-10 mx-auto h-auto w-full max-w-[21rem] -translate-y-6 object-contain sm:max-w-[30rem] sm:-translate-y-8 lg:max-w-[34rem] lg:-translate-y-10"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 z-20 h-14 bg-white sm:h-16 lg:h-20"
                    style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
                  />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className={`mb-5 text-3xl font-bold text-gray-900 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl`}>
                  Ramassage de déjections canines<br />
                  <span className="text-brand-green">à Laval et sur la Rive-Nord</span>
                </h1>
                <p className="mb-8 max-w-3xl text-base text-gray-600 sm:text-xl md:text-2xl lg:max-w-2xl">
                  Obtenez des tarifs clairs, un devis rapide et un service régulier de ramassage à Laval et sur la Rive-Nord. Choisissez votre ville, vérifiez la disponibilité et évitez que la corvée s'accumule.
                </p>
                {/* RESPONSIVE: keep CTA buttons full-width on phones so they are easy to tap. */}
                <div className="flex flex-col items-stretch justify-center gap-4 lg:items-start">
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-brand-green px-6 py-4 text-base text-white hover:bg-brand-green-dark sm:w-[22rem] sm:px-8 sm:py-6 sm:text-lg"
                    asChild
                  >
                    <Link
                      href="#quote-form"
                      data-cta="hero-quote"
                    >
                      Vérifier ma disponibilité
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-600 lg:max-w-md">
                  Aucun contrat. Aucun va-et-vient inutile. Juste un devis rapide et une cour propre.
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-green lg:max-w-md">
                  La plupart des demandes sont confirmées en 1 jour ouvrable.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row sm:flex-wrap lg:justify-start">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                  Aucun contrat
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Camera className="h-4 w-4 text-brand-green" />
                  Photo du portail après chaque visite
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Bell className="h-4 w-4 text-brand-green" />
                  Textos avant l’arrivée
                  </div>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3 lg:max-w-2xl">
                  {[
                    "Service Laval et Rive-Nord",
                    "Réponse habituelle en 1 jour ouvrable",
                    "Photo du portail après la visite",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] px-4 py-3 text-sm font-semibold text-gray-700 shadow-[0_12px_30px_rgba(48,121,68,0.08)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="quote-form" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto scroll-animation">
            <RegularServiceCalculator locale="fr" />

          </div>
        </section>

        {/* Customer Promise Section */}
        {/* RESPONSIVE: add breathing room below the hero on mobile so the next section does not feel cramped. */}
        <section className="bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-0 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
                Ce que vous évitez avec un service régulier
              </h2>
            </div>
            {/* RESPONSIVE: cards stay single-column until medium screens to avoid cramped content. */}
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
                    Vous n’avez plus à vérifier la cour avant chaque sortie du chien ni à penser au nettoyage en rentrant.
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
                  <CardTitle className="text-xl">Une cour qu’on a envie d’utiliser</CardTitle>
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

        {/* About Section */}
        <section id="about" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* RESPONSIVE: tighten stacked section spacing on mobile to reduce long scroll jumps. */}
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-1">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900`}>
                  Pourquoi les propriétaires réservent sur Laval et la Rive-Nord
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
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
                  Ca-Ca Canin est pour les propriétaires de Laval et de la Rive-Nord qui en ont assez de l’odeur, du désordre et du temps perdu à tout nettoyer eux-mêmes.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Vous obtenez une équipe locale, des tarifs clairs et un service simple qui garde la cour prête pour les enfants, les invités et la vraie vie.
                </p>
                <p className="text-lg text-gray-700">
                  L’objectif est simple : vous faire gagner du temps et enlever une corvée de plus de votre semaine.
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

        <BeforeAfterGallery locale="fr" />

        {/* Residential Services */}
        <section id="services" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* RESPONSIVE: keep the service image/text pair balanced as the layout collapses to one column. */}
            <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="scroll-animation order-2 md:order-2">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-gray-900`}>
                  Gardez votre cour propre sans le faire vous-même
                </h2>
                {/* RESPONSIVE: render the section image after the heading on mobile while preserving the desktop side-by-side layout. */}
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
                    <span>Choisissez la fréquence qui empêche la saleté de s’accumuler.</span>
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
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
                  Pourquoi les propriétaires restent avec nous
              </h2>
              <p className="text-xl text-gray-600">
                Pensé pour les propriétaires qui veulent enlever l’odeur, le désordre et une corvée de plus.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                { icon: Heart, title: "Pensé pour les familles occupées", desc: "Nous nettoyons avec soin pour que la cour redevienne prête pour les enfants, les chiens et les invités." },
                { icon: Smartphone, title: "Réponse rapide et locale", desc: "Demandez un devis, réservez le service et obtenez des réponses sans attendre inutilement." },
                { icon: FileText, title: "Sans engagement", desc: "Commencez quand vous en avez besoin et arrêtez quand ce n’est plus utile." },
                { icon: Camera, title: "Photos du portail", desc: "Vous voyez la preuve après chaque visite pour savoir que le travail a été fait." },
                { icon: Bell, title: "Mises à jour de visite", desc: "Vous savez quand nous arrivons, sans vous demander où on en est." },
              ].map((feature, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]" style={{ transitionDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]">
                      <feature.icon className="w-6 h-6 text-brand-green" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <TestimonialsCarousel locale="fr" />
          </div>
        </section>

        {/* Service Areas */}
        <ServiceAreaMap locale="fr" />

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-12 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-gray-900`}>
                Questions que les propriétaires posent avant de réserver
              </h2>
              <p className="text-xl text-gray-600">
                Réponses claires sur les prix, la planification et ce qui se passe après la réservation.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: "Nettoyez-vous toute la cour?", a: "Oui. Nous nettoyons les zones de la propriété où il y a des déjections, y compris l'avant, l'arrière, les côtés et les espaces comme les enclos à chiens." },
                { q: "Offrez-vous le service toute l’année?", a: "Oui. Ca-Ca Canin offre le service toute l’année à Laval et dans les villes desservies de la Rive-Nord, y compris en hiver lorsque le nettoyage demeure accessible." },
                { q: "Comment le prix est-il calculé?", a: "Le prix dépend de la taille de la cour, de la fréquence du service et du nombre de chiens. Utilisez le calculateur pour une estimation, puis demandez un devis pour le prix final." },
                { q: "Dois-je signer un contrat?", a: "Non. Vous pouvez commencer, mettre en pause ou annuler le service en communiquant avec notre équipe." },
                { q: "Que se passe-t-il après chaque visite?", a: "Vous recevez une confirmation de service et, au besoin, une photo du portail après la visite." },
                { q: "Comment les déchets sont-ils disposés?", a: "Les déchets sont mis dans des sacs et déposés dans la poubelle extérieure lorsqu’elle est accessible. Sinon, la disposition suit l’entente prévue pour le service." },
              ].map((faq, index) => (
                <Card key={index} className="scroll-animation border border-[#d7e6da] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.05)] transition-all duration-300 hover:border-brand-green/30 hover:shadow-[0_18px_45px_rgba(48,121,68,0.10)]" style={{ transitionDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7 text-gray-600">
                      {faq.a}
                    </CardDescription>
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
