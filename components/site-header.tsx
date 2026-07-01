'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, PawPrint } from 'lucide-react'
import { REGULAR_SERVICE_LOCATIONS } from '@/lib/regular-service-area'

type Props = {
  locale: 'en' | 'fr'
  altHref: string
  ctaLabel?: string
  ctaHref?: string
  showAnnouncement?: boolean
}

export default function SiteHeader({
  locale,
  altHref,
  ctaLabel,
  ctaHref = '#quote-form',
  showAnnouncement = false,
}: Props) {
  const isFrench = locale === 'fr'
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(
    REGULAR_SERVICE_LOCATIONS[0]?.slug ?? 'laval'
  )

  const defaultCta = isFrench ? 'Vérifier la disponibilité' : 'Check Availability'
  const label = ctaLabel ?? defaultCta

  const navLinks = isFrench
    ? [
        { href: '/fr/a-propos', label: 'À propos' },
        { href: '/fr/faq', label: 'FAQ' },
        { href: '/fr/contact', label: 'Contact' },
      ]
    : [
        { href: '/about', label: 'About' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact' },
      ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <div className="flex items-center justify-between h-16">
          <Link href={isFrench ? '/fr' : '/'} className="flex min-w-0 items-center space-x-3">
            <Image
              src="/images/cacacaninlogo.jpg"
              alt="Ca-Ca Canin logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className={`text-lg font-bold text-brand-green sm:text-2xl`}>
              CA-CA CANIN
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-brand-green transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Locations dropdown */}
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-gray-700 transition-colors hover:text-brand-green"
                aria-label={isFrench ? 'Parcourir les villes desservies' : 'Browse served locations'}
              >
                <span>{isFrench ? 'Villes' : 'Locations'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-3 w-64 max-h-[21rem] overflow-y-auto rounded-2xl border border-[#d7e6da] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(17,24,39,0.08)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {REGULAR_SERVICE_LOCATIONS.map((location) => (
                  <Link
                    key={location.slug}
                    href={
                      isFrench
                        ? `/fr/ramassage-dejections/${location.slug}`
                        : `/dog-poop-cleanup/${location.slug}`
                    }
                    className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-[#eef7f0] hover:text-brand-green"
                  >
                    {location.name}
                  </Link>
                ))}
                <Link
                  href={isFrench ? '/fr/ramassage-dejections' : '/dog-poop-cleanup'}
                  className="block rounded-xl border-t border-gray-100 px-4 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-[#eef7f0]"
                >
                  {isFrench ? 'Voir toutes les villes →' : 'See all locations →'}
                </Link>
              </div>
            </div>

            {/* Language toggle */}
            <Link
              href={altHref}
              className={`transition-colors ${
                isFrench
                  ? 'text-brand-brown hover:text-brand-brown/80'
                  : 'text-brand-brown hover:text-brand-brown/80'
              }`}
            >
              {isFrench ? 'English' : 'Français'}
            </Link>

            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white" asChild>
              <Link href={ctaHref} data-cta="header-cta">
                {label}
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-3"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div id="mobile-nav" className="space-y-2 border-t border-gray-200 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md py-2 text-gray-700 hover:text-brand-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {isFrench ? 'Villes' : 'Locations'}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value)
                  router.push(
                    isFrench
                      ? `/fr/ramassage-dejections/${e.target.value}`
                      : `/dog-poop-cleanup/${e.target.value}`
                  )
                  setIsMenuOpen(false)
                }}
                className="h-11 w-full rounded-xl border border-[#d7e6da] px-3 text-sm text-gray-700"
              >
                {REGULAR_SERVICE_LOCATIONS.map((location) => (
                  <option key={location.slug} value={location.slug}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href={altHref}
              className="block rounded-md py-2 text-brand-brown hover:text-brand-brown/80"
              onClick={() => setIsMenuOpen(false)}
            >
              {isFrench ? 'English' : 'Français'}
            </Link>
            <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white" asChild>
              <Link href={ctaHref} data-cta="header-cta" onClick={() => setIsMenuOpen(false)}>
                {label}
              </Link>
            </Button>
          </div>
        )}
      </nav>

      {showAnnouncement && (
        <Link
          href={isFrench ? '/fr/nettoyage-gratuit' : '/free-cleanup'}
          className="relative block overflow-hidden bg-brand-green px-10 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-green-dark sm:px-12 sm:text-sm"
        >
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none opacity-70" aria-hidden="true">
            <PawPrint className="h-4 w-4" />
          </span>
          {isFrench
            ? 'Premier nettoyage gratuit avec un service récurrent. Réclamez le vôtre →'
            : 'Your first cleanup is free with recurring service. Claim yours →'}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none opacity-70" aria-hidden="true">
            <PawPrint className="h-4 w-4" />
          </span>
        </Link>
      )}
    </header>
  )
}
