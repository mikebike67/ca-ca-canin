'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  name: string
  location: string
  text: string
  source: 'Google' | 'Facebook'
}

const testimonials: Testimonial[] = [
  {
    name: 'Zander M.',
    location: 'Laval',
    text: "Wanted to share my experience with Micheal from Ca-Ca Canin, very professional, he came over to asses our lawn , which let me tell you was a doozy and a half to say the least , old tenants left garbage in thw yard the grass was almost 4 feet tall with random shrubs and over growth literally everywhere , yoy couldn't see the ground, they hadn't cleaned the yard in years there dog made basically a layer of poop , Micheal came out and meticulously lifted everything and got most of turd mines . For 80$ I couldn't have spent my money more wisely , I recommend Micheal to everyone who owns a dog and needs some help with their yard . KEEP IT UP MAN 💪💯",
    source: 'Google',
  },
  {
    name: 'Daniella H.',
    location: 'Deux-Montagnes',
    text: "Michael is fantastic! Super professional, clean, and his customer service is 100%.\n\nWe hired Michael to clean our yard after a long winter and would do so again in a heartbeat! He offers a great service at a great price. Truly can't recommend him enough!",
    source: 'Google',
  },
  {
    name: 'Julie B.',
    location: 'Laval',
    text: "Michael's attention to detail is one of his best attributes. He did a thorough job of cleaning up all the doggy poop from this past winter. His attitude is professional, efficient and personable. As a dog owner himself, he understands how much we love our fur babies AND keeping our environment clean. I highly recommend his services, and I will use him again.",
    source: 'Google',
  },
  {
    name: 'Nick M.',
    location: 'Laval',
    text: "Super professional and Michael made booking so easy. The best dog poop removal service in Laval by FAR! Thanks Michael!",
    source: 'Google',
  },
  {
    name: 'Mohamed L.',
    location: 'Boisbriand',
    text: "Service impeccable de Ca-Ca Canin. Rapide, professionnel et ma cour est redevenue parfaitement propre après leur passage. Ça enlève vraiment une grosse corvée quand on a un chien.\n\nLe prix est très raisonnable et le travail est très bien fait. Je recommande sans hésiter à tous les propriétaires de chiens. Service 5 étoiles.",
    source: 'Google',
  },
  {
    name: 'Elisa A.',
    location: 'Laval',
    text: "I recently had the pleasure of hiring a young entrepreneur who runs a dog waste removal service, and I couldn't be more impressed. He arrived right on time, was extremely professional, and got straight to work.\nNot only did he do a thorough and efficient job, but he also paid attention to detail and left my yard looking spotless. It's clear he takes pride in his work and is serious about his business.\nIt's always great to support someone who is motivated and dependable, and he absolutely delivered on both. I would highly recommend Michael's services to anyone looking for a reliable and hassle-free solution for keeping their yard clean. Thank you !!!",
    source: 'Facebook',
  },
  {
    name: 'Pete B.',
    location: 'Lorraine',
    text: "Very professional job.  Winter snow just melted to reveal all of the winter's poop.  \nThankfully I was given Michael's number. He came super fast with all his equipment and in no time my yard was spotless.",
    source: 'Facebook',
  },
  {
    name: 'Sylvain D.',
    location: 'Mirabel',
    text: "Excellent travail! Je recommande fortement!",
    source: 'Facebook',
  },
  {
    name: 'Cel Yne',
    location: 'Laval',
    text: "Excellent service ! Je le recommande à tous les propriétaires de chiens qui ne veulent pas ou ne peuvent pas ramasser les petits (ou gros selon le chien) dégâts. C'est un casse tête en moins sur la liste. Merci !",
    source: 'Facebook',
  },
]

const copy = {
  en: {
    title: 'What Our Customers Say',
    subtitle: 'Real reviews from real customers in your neighbourhood',
    prevLabel: 'Previous review',
    nextLabel: 'Next review',
    dotLabel: (n: number) => `Go to review ${n}`,
  },
  fr: {
    title: 'Ce que nos clients disent',
    subtitle: 'De vrais avis de vrais clients dans votre quartier',
    prevLabel: 'Avis précédent',
    nextLabel: 'Avis suivant',
    dotLabel: (n: number) => `Voir l'avis ${n}`,
  },
}

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <div className="border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] rounded-2xl p-8 flex flex-col h-[520px] sm:h-[460px] md:h-[400px]">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4 flex-shrink-0">
        <div>
          <p className="text-xl font-bold text-gray-900">{t.name}</p>
          <p className="text-sm text-gray-500">{t.location}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
            t.source === 'Google'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}
        >
          {t.source === 'Google' ? '★ Google Review' : '✓ Facebook Recommended'}
        </span>
      </div>

      <div className="flex gap-0.5 mb-4 flex-shrink-0">
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className="text-[#f59e0b] text-xl">★</span>
        ))}
      </div>

      <div className="text-brand-green text-5xl font-serif leading-none mb-3 select-none flex-shrink-0">&ldquo;</div>

      <div className="flex-1 overflow-y-auto pr-1">
        <p className="text-gray-700 text-base sm:text-lg leading-8 whitespace-pre-line">{t.text}</p>
      </div>
    </div>
  )
}

export default function TestimonialsCarousel({ locale }: { locale: 'en' | 'fr' }) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)

  const n = testimonials.length
  const prevIdx = (current - 1 + n) % n
  const nextIdx = (current + 1) % n

  const navigateTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 200)
  }, [])

  const handlePrev = useCallback(() => {
    navigateTo((current - 1 + n) % n)
  }, [current, n, navigateTo])

  const handleNext = useCallback(() => {
    navigateTo((current + 1) % n)
  }, [current, n, navigateTo])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % n)
        setFading(false)
      }, 200)
    }, 5000)
    return () => clearInterval(id)
  }, [paused, n])

  const c = copy[locale]

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{c.title}</h2>
        <p className="text-xl text-gray-600">{c.subtitle}</p>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`flex items-stretch gap-3 sm:gap-4 transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>

          {/* Left peek — desktop only */}
          <div className="hidden sm:block relative w-56 flex-shrink-0 overflow-hidden rounded-2xl opacity-30 pointer-events-none">
            <ReviewCard t={testimonials[prevIdx]} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50" />
          </div>

          {/* Center card */}
          <div className="flex-1 min-w-0">
            <ReviewCard t={testimonials[current]} />
          </div>

          {/* Right peek — desktop only */}
          <div className="hidden sm:block relative w-56 flex-shrink-0 overflow-hidden rounded-2xl opacity-30 pointer-events-none">
            <ReviewCard t={testimonials[nextIdx]} />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50" />
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={handlePrev}
          aria-label={c.prevLabel}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e6da] bg-white shadow-md hover:border-brand-green/40 transition-all sm:-left-5"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={handleNext}
          aria-label={c.nextLabel}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e6da] bg-white shadow-md hover:border-brand-green/40 transition-all sm:-right-5"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => navigateTo(i)}
            aria-label={c.dotLabel(i + 1)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-brand-green' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
