'use client'

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { DogCount } from "@/lib/booking"

const LAVAL_PROXIMITY = "-73.92,45.635"
// Roughly bounds the province of Quebec (minLon,minLat,maxLon,maxLat) to keep suggestions in-province.
const QUEBEC_BBOX = "-79.98,44.99,-56.93,62.58"

type AddressSuggestion = { id: string; placeName: string }

export default function FreeTrialSignup({ locale }: { locale: "en" | "fr" }) {
  const isFrench = locale === "fr"
  const router = useRouter()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [dogs, setDogs] = useState<DogCount>("1")
  const [websiteField, setWebsiteField] = useState("")

  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const addressBoxRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const skipNextFetchRef = useRef(false)

  const [consentChecked, setConsentChecked] = useState(false)
  const [consentError, setConsentError] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [spotsStatus, setSpotsStatus] = useState<"loading" | "ready">("loading")
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/free-trial")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setRemaining(typeof data.remaining === "number" ? data.remaining : null)
        setSpotsStatus("ready")
      })
      .catch(() => {
        if (cancelled) return
        setRemaining(null)
        setSpotsStatus("ready")
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isFull = remaining !== null && remaining <= 0

  // Address autocomplete via Mapbox Geocoding (reuses the same public token as the service area map)
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false
      return
    }

    const query = address.trim()
    if (query.length < 1) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    const timeout = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const params = new URLSearchParams({
          access_token: token,
          autocomplete: "true",
          country: "ca",
          types: "address",
          language: isFrench ? "fr" : "en",
          proximity: LAVAL_PROXIMITY,
          bbox: QUEBEC_BBOX,
          limit: "5",
        })
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`,
          { signal: controller.signal },
        )
        const data = await res.json()
        const suggestions: AddressSuggestion[] = Array.isArray(data.features)
          ? data.features.map((f: any) => ({ id: f.id, placeName: f.place_name }))
          : []
        setAddressSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
        setHighlightedIndex(-1)
      } catch {
        // Aborted or network error — leave suggestions as-is.
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [address, isFrench])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addressBoxRef.current && !addressBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    skipNextFetchRef.current = true
    setAddress(suggestion.placeName)
    setAddressSuggestions([])
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || addressSuggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((i) => (i + 1) % addressSuggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((i) => (i <= 0 ? addressSuggestions.length - 1 : i - 1))
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        e.preventDefault()
        selectSuggestion(addressSuggestions[highlightedIndex])
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité pour continuer."
          : "Please agree to the Terms and Privacy Policy to continue.",
      )
      return
    }
    setConsentError("")

    setSubmitStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          dogs,
          consent: true,
          website: websiteField,
          locale,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          data.error || (isFrench ? "Échec de l'envoi. Veuillez réessayer." : "Failed to send. Please try again."),
        )
      }

      const type = data.duplicate ? "trial-duplicate" : data.waitlisted ? "trial-waitlist" : "trial"
      router.push(`/thank-you?lang=${locale}&type=${type}`)
    } catch (err: any) {
      setSubmitStatus("error")
      setErrorMessage(
        err?.message || (isFrench ? "Une erreur s'est produite. Veuillez réessayer." : "Something went wrong. Please try again."),
      )
    }
  }

  return (
    <div id="signup" className="scroll-mt-12 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-6 text-center">
        {spotsStatus === "ready" && remaining !== null && (
          <span
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold ${
              isFull
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-brand-green/30 bg-[#eef7f0] text-brand-green"
            }`}
          >
            {isFull
              ? (isFrench ? "Les 10 places sont prises · Liste d'attente" : "All 10 spots are claimed · Waitlist open")
              : (isFrench
                  ? `${remaining} sur 10 places disponibles`
                  : `${remaining} of 10 spots left`)}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={websiteField}
            onChange={(e) => setWebsiteField(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            {isFrench ? "Nom" : "Name"}
          </label>
          <input
            type="text"
            name="name"
            placeholder={isFrench ? "Jean Dupont" : "Jane Doe"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            {isFrench ? "Téléphone" : "Phone number"}
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="438 880 8922"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            {isFrench ? "Courriel" : "Email"}
          </label>
          <input
            type="email"
            name="email"
            placeholder={isFrench ? "vous@courriel.com" : "you@email.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div className="space-y-1 relative" ref={addressBoxRef}>
          <label className="text-sm font-semibold text-gray-700">
            {isFrench ? "Adresse complète" : "Full address"}
          </label>
          <input
            type="text"
            name="address"
            placeholder={isFrench ? "123 rue Example, Laval, QC H7A 1A1" : "123 Example St, Laval, QC H7A 1A1"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleAddressKeyDown}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls="address-suggestions"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          {showSuggestions && addressSuggestions.length > 0 && (
            <ul
              id="address-suggestions"
              role="listbox"
              className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {addressSuggestions.map((suggestion, index) => (
                <li key={suggestion.id} role="option" aria-selected={index === highlightedIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`w-full px-3 py-2 text-left text-sm ${
                      index === highlightedIndex ? "bg-[#eef7f0] text-brand-green" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {suggestion.placeName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {isFrench ? "Nombre de chiens" : "Number of Dogs"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "1", en: "1 Dog", fr: "1 chien" },
              { key: "2", en: "2 Dogs", fr: "2 chiens" },
              { key: "3plus", en: "3+ Dogs", fr: "3+ chiens" },
            ] as { key: DogCount; en: string; fr: string }[]).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setDogs(item.key)}
                className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  dogs === item.key
                    ? "bg-brand-green text-white border-brand-green shadow-md"
                    : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                }`}
              >
                {isFrench ? item.fr : item.en}
              </button>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="rounded-xl border border-[#d7e6da] bg-[#f7faf7] p-4">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => {
                setConsentChecked(e.target.checked)
                setConsentError("")
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
            />
            <span>
              {isFrench ? "J'accepte les " : "I agree to the "}
              <Link href={isFrench ? "/fr/terms" : "/terms"} className="font-semibold text-brand-green hover:underline">
                {isFrench ? "conditions" : "Terms"}
              </Link>
              {isFrench ? " et la " : " and "}
              <Link href={isFrench ? "/fr/privacy" : "/privacy"} className="font-semibold text-brand-green hover:underline">
                {isFrench ? "politique de confidentialité" : "Privacy Policy"}
              </Link>
              {isFrench
                ? " et j'autorise Ca-Ca Canin à me contacter au sujet de ma demande."
                : " and allow Ca-Ca Canin to contact me about my request."}
            </span>
          </label>
          {consentError && (
            <p className="mt-2 text-sm text-red-600" role="alert">{consentError}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitStatus === "loading"}
          className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3"
        >
          {submitStatus === "loading"
            ? (isFrench ? "Envoi…" : "Sending…")
            : isFull
              ? (isFrench ? "Rejoindre la liste d'attente" : "Join the waitlist")
              : (isFrench ? "Réserver ma place" : "Claim my spot")}
        </Button>

        {submitStatus === "error" && (
          <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
        )}

        <p className="text-xs text-gray-500">
          {isFrench
            ? "Offre limitée à 10 foyers, une place par adresse. 1 visite par semaine pendant 2 semaines, en échange de vos commentaires."
            : "Limited to 10 households, one spot per address. 1 visit per week for 2 weeks, in exchange for your feedback."}
        </p>
      </form>
    </div>
  )
}
