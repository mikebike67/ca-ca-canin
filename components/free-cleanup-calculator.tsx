'use client'

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  applyDiscount,
  calculateBookingPrice,
  getMonthlyVisits,
  getYardCategory,
  isCanadianPostalCode,
  normalizePostalCode,
  type DogCount,
  type YardCategory,
} from "@/lib/booking"
import { isRegularServicePostalCode } from "@/lib/regular-service-area"

type PromoFrequency = "weekly" | "biweekly"

const yardOptions: Record<"en" | "fr", { key: YardCategory; label: string; detail: string }[]> = {
  en: [
    { key: "small",  label: "Standard / Small", detail: "~1,000–3,000 sq ft" },
    { key: "medium", label: "Medium",            detail: "~3,000–6,000 sq ft" },
    { key: "large",  label: "Large",             detail: "~6,000–10,000 sq ft" },
    { key: "xlarge", label: "X-Large",           detail: "10,000+ sq ft" },
  ],
  fr: [
    { key: "small",  label: "Standard / Petit", detail: "~1 000–3 000 pi²" },
    { key: "medium", label: "Moyen",             detail: "~3 000–6 000 pi²" },
    { key: "large",  label: "Grand",             detail: "~6 000–10 000 pi²" },
    { key: "xlarge", label: "Très grand",        detail: "10 000+ pi²" },
  ],
}

const frequencyNotes: Record<"en" | "fr", Record<PromoFrequency, string>> = {
  en: {
    weekly:   "Best for keeping your yard clean week after week.",
    biweekly: "A practical balance of price and upkeep.",
  },
  fr: {
    weekly:   "Le meilleur choix pour garder la cour propre chaque semaine.",
    biweekly: "Un bon équilibre entre prix et entretien.",
  },
}

const formatMoney = (v: number) => `$${v.toFixed(2)}`
const formatDiscountLabel = (type: "flat" | "percent", amount: number) => (type === "percent" ? `${amount}%` : formatMoney(amount))

export default function FreeCleanupCalculator({ locale }: { locale: "en" | "fr" }) {
  const isFrench = locale === "fr"
  const router = useRouter()

  const [frequency, setFrequency] = useState<PromoFrequency>("weekly")
  const [dogs, setDogs]           = useState<DogCount>("1")
  const [yardSqft, setYardSqft]   = useState(3000)
  const [displayPrice, setDisplayPrice] = useState(0)

  const [name,       setName]       = useState("")
  const [phone,      setPhone]      = useState("")
  const [email,      setEmail]      = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [websiteField, setWebsiteField] = useState("")

  const [consentChecked, setConsentChecked] = useState(false)
  const [consentError,   setConsentError]   = useState("")
  const [postalError,    setPostalError]    = useState("")
  const [submitStatus,   setSubmitStatus]   = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage,   setErrorMessage]   = useState("")

  const [referralCode, setReferralCode] = useState("")
  const [referralStatus, setReferralStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle")
  const [referralDiscount, setReferralDiscount] = useState(0)
  const [referralType, setReferralType] = useState<"flat" | "percent">("flat")
  const [referralRecurring, setReferralRecurring] = useState(false)
  const [referralRequiresProof, setReferralRequiresProof] = useState(false)

  const yardCategory = useMemo(() => getYardCategory(yardSqft), [yardSqft])

  const perVisit = useMemo(
    () => calculateBookingPrice(frequency, dogs, yardSqft),
    [frequency, dogs, yardSqft],
  )

  const monthlyTotal = useMemo(
    () => Math.round(perVisit * getMonthlyVisits(frequency) * 100) / 100,
    [frequency, perVisit],
  )

  const discountedFirstPaidMonthPrice = useMemo(
    () => (referralStatus === "valid" ? applyDiscount(monthlyTotal, { type: referralType, amount: referralDiscount }) : null),
    [referralStatus, referralDiscount, referralType, monthlyTotal],
  )

  const handleApplyReferral = async () => {
    const code = referralCode.trim()
    if (!code) return

    setReferralStatus("checking")

    try {
      const res = await fetch("/api/validate-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await res.json().catch(() => ({ valid: false }))

      if (data.valid) {
        setReferralStatus("valid")
        setReferralDiscount(data.discount ?? 0)
        setReferralType(data.type === "percent" ? "percent" : "flat")
        setReferralRecurring(Boolean(data.recurring))
        setReferralRequiresProof(Boolean(data.requiresProof))
      } else {
        setReferralStatus("invalid")
        setReferralDiscount(0)
        setReferralType("flat")
        setReferralRecurring(false)
        setReferralRequiresProof(false)
      }
    } catch {
      setReferralStatus("invalid")
      setReferralDiscount(0)
      setReferralType("flat")
      setReferralRecurring(false)
      setReferralRequiresProof(false)
    }
  }

  // Animate price counter
  useEffect(() => {
    const duration = 350
    const start = displayPrice
    const end   = perVisit
    const startTime = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayPrice(start + (end - start) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [perVisit])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let hasError = false

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité pour continuer."
          : "Please agree to the Terms and Privacy Policy to continue.",
      )
      hasError = true
    } else {
      setConsentError("")
    }

    const normalized = normalizePostalCode(postalCode)
    if (!isCanadianPostalCode(normalized)) {
      setPostalError(
        isFrench ? "Veuillez entrer un code postal canadien valide." : "Please enter a valid Canadian postal code.",
      )
      hasError = true
    } else {
      setPostalError("")
    }

    if (hasError) return

    setSubmitStatus("loading")
    setErrorMessage("")

    const outOfArea = !isRegularServicePostalCode(normalizePostalCode(postalCode))

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          postalCode: normalizePostalCode(postalCode),
          consent: true,
          website: websiteField,
          locale,
          source: "free-first-cleanup",
          promo: "free-first-cleanup",
          freeFirstVisit: true,
          frequency,
          dogs,
          yardSqft,
          price: perVisit,
          outOfArea,
          referralCode: referralStatus === "valid" ? referralCode.trim() : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.error || (isFrench ? "Échec de l'envoi. Veuillez réessayer." : "Failed to send. Please try again."),
        )
      }

      setReferralCode("")
      setReferralStatus("idle")
      setReferralDiscount(0)
      setReferralType("flat")
      setReferralRecurring(false)
      setReferralRequiresProof(false)
      router.push(`/thank-you?lang=${locale}&type=quote`)
    } catch (err: any) {
      setSubmitStatus("error")
      setErrorMessage(
        err?.message || (isFrench ? "Une erreur s'est produite. Veuillez réessayer." : "Something went wrong. Please try again."),
      )
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-2">

        {/* LEFT: Selectors + price preview */}
        <div className="space-y-6">

          {/* Frequency */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {isFrench ? "Fréquence" : "Frequency"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "weekly",   en: "Weekly",    fr: "Hebdomadaire" },
                { key: "biweekly", en: "Bi-Weekly", fr: "Aux deux semaines" },
              ] as { key: PromoFrequency; en: string; fr: string }[]).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFrequency(item.key)}
                  className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    frequency === item.key
                      ? "bg-brand-green text-white border-brand-green shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                  }`}
                >
                  {isFrench ? item.fr : item.en}
                </button>
              ))}
            </div>
          </div>

          {/* Dog count */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {isFrench ? "Nombre de chiens" : "Number of Dogs"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "1",     en: "1 Dog",   fr: "1 chien" },
                { key: "2",     en: "2 Dogs",  fr: "2 chiens" },
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

          {/* Yard size */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              {isFrench ? "Taille de la cour (pi²)" : "Yard Size (sq ft)"}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={3000}
                max={10000}
                step={100}
                value={yardSqft}
                onChange={(e) => {
                  const snapped = Math.round(Number(e.target.value) / 100) * 100
                  setYardSqft(Math.max(3000, Math.min(10000, snapped)))
                }}
                className="w-full accent-brand-green"
              />
              <div className="space-y-1">
                <span className="block text-sm font-semibold text-brand-green">
                  {yardSqft >= 10000
                    ? (isFrench ? "10 000+ pi²" : "10,000+ sq ft")
                    : (isFrench ? `${yardSqft.toLocaleString()} pi²` : `${yardSqft.toLocaleString()} sq ft`)}
                </span>
                <span className="inline-flex rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green">
                  {yardOptions[locale].find((o) => o.key === yardCategory)?.label}
                  {" · "}
                  {yardOptions[locale].find((o) => o.key === yardCategory)?.detail}
                </span>
              </div>
            </div>
          </div>

          {/* Price preview */}
          <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80 mb-1">
              {isFrench ? "Votre 1re visite" : "Your first visit"}
            </p>
            <p className="text-4xl font-extrabold text-brand-green mb-3">
              {isFrench ? "GRATUITE" : "FREE"}
            </p>
            <div className="rounded-2xl bg-white/75 p-3 shadow-sm space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                  {isFrench ? "Ensuite, par visite" : "Then, per visit"}
                </p>
                <p className="text-2xl font-extrabold tabular-nums text-gray-900">
                  {formatMoney(displayPrice)}
                  <span className="ml-1 text-base font-semibold text-gray-500">
                    {isFrench ? "/visite" : "/visit"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                  {isFrench ? "Total mensuel estimé" : "Estimated monthly"}
                </p>
                {referralStatus === "valid" && discountedFirstPaidMonthPrice !== null ? (
                  <>
                    <p className="flex flex-wrap items-baseline gap-2">
                      <span className="text-base font-semibold text-gray-400 line-through">
                        {formatMoney(monthlyTotal)}
                      </span>
                      <span className="text-xl font-extrabold tabular-nums text-brand-green">
                        {formatMoney(discountedFirstPaidMonthPrice)}
                        <span className="ml-1 text-sm font-semibold text-gray-500">
                          {referralRecurring
                            ? (isFrench ? "chaque mois" : "every month")
                            : (isFrench ? "ce premier mois payant" : "this first paid month")}
                        </span>
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {referralRecurring
                        ? (isFrench
                            ? `${formatDiscountLabel(referralType, referralDiscount)} de rabais applique en continu.`
                            : `${formatDiscountLabel(referralType, referralDiscount)} off, applied on an ongoing basis.`)
                        : (isFrench
                            ? `Puis ${formatMoney(monthlyTotal)}/mois par la suite.`
                            : `Then ${formatMoney(monthlyTotal)}/month after that.`)}
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-extrabold tabular-nums text-brand-green">
                    {formatMoney(monthlyTotal)}
                    <span className="ml-1 text-sm font-semibold text-gray-500">
                      {isFrench ? "/mois" : "/month"}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-brand-green">
              {frequencyNotes[locale][frequency]}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {isFrench ? "Sans contrat. Annulation facile." : "No contracts. Cancel anytime."}
            </p>

            <div className="mt-4 border-t border-brand-green/10 pt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                {isFrench ? "Code de parrainage ou de partenaire (optionnel)" : "Referral or partner code (optional)"}
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value)
                    setReferralStatus("idle")
                  }}
                  placeholder={isFrench ? "Entrez le code" : "Enter code"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <Button
                  type="button"
                  onClick={handleApplyReferral}
                  disabled={referralStatus === "checking" || !referralCode.trim()}
                  className="shrink-0 bg-brand-green text-white hover:bg-brand-green-dark"
                >
                  {referralStatus === "checking"
                    ? "..."
                    : (isFrench ? "Appliquer" : "Apply")}
                </Button>
              </div>
              {referralStatus === "valid" && discountedFirstPaidMonthPrice !== null && (
                <p className="mt-2 text-sm font-semibold text-brand-green" role="status" aria-live="polite">
                  {referralRecurring
                    ? (isFrench
                        ? `Code appliqué : ${formatDiscountLabel(referralType, referralDiscount)} de rabais chaque mois → ${formatMoney(discountedFirstPaidMonthPrice)}`
                        : `Code applied: ${formatDiscountLabel(referralType, referralDiscount)} off every month → ${formatMoney(discountedFirstPaidMonthPrice)}`)
                    : (isFrench
                        ? `Code appliqué : ${formatDiscountLabel(referralType, referralDiscount)} de rabais sur votre premier mois payant → ${formatMoney(discountedFirstPaidMonthPrice)}`
                        : `Code applied: ${formatDiscountLabel(referralType, referralDiscount)} off your first paid month → ${formatMoney(discountedFirstPaidMonthPrice)}`)}
                </p>
              )}
              {referralStatus === "valid" && referralRequiresProof && (
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="status" aria-live="polite">
                  {isFrench
                    ? "Ce code necessite une preuve d'adoption ou d'accueil (foster). Ayez votre certificat pret, nous confirmerons le rabais apres verification."
                    : "This code requires proof of adoption/fostering. Please have your certificate ready, we'll confirm the discount after verification."}
                </p>
              )}
              {referralStatus === "invalid" && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {isFrench ? "Code de parrainage invalide." : "That referral code isn't valid."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Contact form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">

            <p className="text-sm font-semibold text-brand-green">
              {isFrench ? "Vos coordonnées" : "Your contact information"}
            </p>

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

            <div className="space-y-3">
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

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  {isFrench ? "Code postal" : "Postal code"}
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="H7A 1A1"
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.target.value)
                    setPostalError("")
                  }}
                  autoComplete="postal-code"
                  inputMode="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                {postalError && (
                  <p className="text-sm text-red-600" role="alert">{postalError}</p>
                )}
              </div>
            </div>

            {/* Consent — immediately above CTA */}
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
                : (isFrench ? "Obtenir mon nettoyage gratuit" : "Get your free cleanup")}
            </Button>

            {submitStatus === "error" && (
              <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
            )}

            <p className="text-xs text-gray-500">
              {isFrench
                ? "Offre valable pour les nouveaux clients récurrents seulement. Expire le 31 juillet 2026. La plupart des demandes sont confirmées en 1 jour ouvrable."
                : "Offer valid for new recurring customers only. Expires July 31, 2026. Most requests confirmed within 1 business day."}
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}
