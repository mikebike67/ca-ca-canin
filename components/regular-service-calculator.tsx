'use client'

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateBookingPrice,
  getMonthlyVisits,
  getYardCategory,
  isCanadianPostalCode,
  normalizePostalCode,
  type DogCount,
  type ServiceFrequency,
  type YardCategory,
} from "@/lib/booking";
import { isRegularServicePostalCode } from "@/lib/regular-service-area";
import Link from "next/link";


const yardOptions: Record<"en" | "fr", { key: YardCategory; label: string; detail: string }[]> = {
  en: [
    { key: "small", label: "Standard / Small", detail: "~1,000-3,000 sq ft" },
    { key: "medium", label: "Medium", detail: "~3,000-6,000 sq ft" },
    { key: "large", label: "Large", detail: "~6,000-10,000 sq ft" },
    { key: "xlarge", label: "X-Large", detail: "10,000+ sq ft" },
  ],
  fr: [
    { key: "small", label: "Standard / Petit", detail: "~1 000-3 000 pi²" },
    { key: "medium", label: "Moyen", detail: "~3 000-6 000 pi²" },
    { key: "large", label: "Grand", detail: "~6 000-10 000 pi²" },
    { key: "xlarge", label: "Très grand", detail: "10 000+ pi²" },
  ],
};

const frequencyNotes: Record<"en" | "fr", Record<ServiceFrequency, string>> = {
  en: {
    weekly: "Best for keeping your yard clean week after week.",
    biweekly: "A practical balance of price and upkeep.",
    monthly: "A simple option for lighter maintenance.",
    onetime: "Includes up to 30 minutes. Add $5 for each extra 5 minutes.",
  },
  fr: {
    weekly: "Le meilleur choix pour garder la cour propre chaque semaine.",
    biweekly: "Un bon équilibre entre prix et entretien.",
    monthly: "Une option simple pour un entretien léger.",
    onetime: "Inclut jusqu'à 30 minutes. Ajoutez 5 $ par tranche supplémentaire de 5 minutes.",
  },
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;


type RegularServiceCalculatorProps = {
  locale: "en" | "fr";
  instanceId?: string;
};

export default function RegularServiceCalculator({ locale, instanceId }: RegularServiceCalculatorProps) {
  const isFrench = locale === "fr";
  const idPrefix = instanceId ?? locale;
  const router = useRouter();
  const [frequency, setFrequency] = useState<ServiceFrequency>("weekly");
  const [dogs, setDogs] = useState<DogCount>("1");
  const [yardSqft, setYardSqft] = useState(3000);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [postalCode, setPostalCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalStatus, setPostalStatus] = useState<"idle" | "valid" | "invalid" | "out_of_area">("idle");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [websiteField, setWebsiteField] = useState("");

  const yardCategory = useMemo(() => getYardCategory(yardSqft), [yardSqft]);

  const pricingDetails = useMemo(() => {
    const perVisit = calculateBookingPrice(frequency, dogs, yardSqft);
    return { perVisit, note: frequencyNotes[locale][frequency] };
  }, [dogs, frequency, locale, yardSqft]);

  const monthlyTotal = useMemo(() => {
    const visitsPerMonth = getMonthlyVisits(frequency);
    return Math.round(pricingDetails.perVisit * visitsPerMonth * 100) / 100;
  }, [frequency, pricingDetails.perVisit]);

  useEffect(() => {
    const duration = 350;
    const start = displayPrice;
    const end = pricingDetails.perVisit;
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = start + (end - start) * eased;
      setDisplayPrice(value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pricingDetails.perVisit]);

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité pour continuer."
          : "Please agree to the Terms and Privacy Policy to continue.",
      );
      return;
    }

    setConsentError("");

    if (!isRegularServicePostalCode(normalized)) {
      setPostalStatus("out_of_area");
      return;
    }

    setPostalStatus("valid");
  };

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité avant l'envoi."
          : "Please agree to the Terms and Privacy Policy before submitting.",
      );
      return;
    }

    if (!isCanadianPostalCode(postalCode)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    setBookingStatus("loading");
    setBookingMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          consent: true,
          website: websiteField,
          locale,
          source: "home-calculator",
          postalCode: normalizePostalCode(postalCode),
          frequency,
          dogs,
          yardSqft,
          price: pricingDetails.perVisit,
          outOfArea: postalStatus === "out_of_area",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || (isFrench ? "Échec de l'envoi de la confirmation." : "Failed to send confirmation."),
        );
      }

      setPostalCode("");
      setName("");
      setPhone("");
      setEmail("");
      setConsentChecked(false);
      setConsentError("");
      setPostalStatus("idle");
      setWebsiteField("");
      router.push(`/thank-you?lang=${locale}&type=quote`);
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(
        err?.message || (isFrench ? "Une erreur s'est produite. Veuillez réessayer." : "Something went wrong. Please try again."),
      );
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
          {isFrench ? "Vérifiez votre disponibilité et voyez votre prix" : "Check Availability and See Your Price"}
        </h2>
        <p className="text-lg text-gray-600">
          {isFrench
            ? "Choisissez la taille de votre cour, le nombre de chiens et la fréquence pour obtenir une estimation réelle et demander le service tout de suite."
            : "Pick your yard size, dog count, and schedule to get a real estimate and request service right away."}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Selectors */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">{isFrench ? "Fréquence" : "Frequency"}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "weekly",   en: "Weekly",       fr: "Hebdomadaire" },
                  { key: "biweekly", en: "Bi-Weekly",    fr: "Aux deux semaines" },
                  { key: "monthly",  en: "Monthly",      fr: "Mensuel" },
                  { key: "onetime",  en: "One-Time",     fr: "Ponctuel" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFrequency(item.key as ServiceFrequency)}
                    className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      frequency === item.key
                        ? "bg-brand-green text-white border-brand-green shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                    }`}
                    type="button"
                  >
                    {isFrench ? item.fr : item.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">{isFrench ? "Nombre de chiens" : "Number of Dogs"}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "1",     en: "1 Dog",   fr: "1 chien" },
                  { key: "2",     en: "2 Dogs",  fr: "2 chiens" },
                  { key: "3plus", en: "3+ Dogs", fr: "3+ chiens" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setDogs(item.key as DogCount)}
                    className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      dogs === item.key
                        ? "bg-brand-green text-white border-brand-green shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                    }`}
                    type="button"
                  >
                    {isFrench ? item.fr : item.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor={`yard-size-${idPrefix}`} className="text-sm font-semibold text-gray-700 mb-3 block">
                {isFrench ? "Taille de la cour (pi²)" : "Yard Size (sq ft)"}
              </label>
              <div className="space-y-2">
                <input
                  id={`yard-size-${idPrefix}`}
                  type="range"
                  min={3000}
                  max={10000}
                  step={100}
                  value={yardSqft}
                  onChange={(e) => {
                    const raw = Number(e.target.value);
                    const snapped = Math.round(raw / 100) * 100;
                    const clamped = Math.max(3000, Math.min(10000, snapped));
                    setYardSqft(clamped);
                  }}
                  className="w-full accent-brand-green"
                  required
                />
                <div className="space-y-1">
                  <span className="block text-sm font-semibold text-brand-green">
                    {yardSqft >= 10000
                      ? (isFrench ? "10 000+ pi²" : "10,000+ sq ft")
                      : (isFrench ? `${yardSqft.toLocaleString()} pi²` : `${yardSqft.toLocaleString()} sq ft`)}
                  </span>
                  <span className="inline-flex rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green">
                    {yardOptions[locale].find((option) => option.key === yardCategory)?.label} · {yardOptions[locale].find((option) => option.key === yardCategory)?.detail}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Price summary + Form */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-center lg:text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                {frequency === "onetime"
                  ? (isFrench ? "Visite estimée" : "Estimated Visit")
                  : (isFrench ? "Estimation par visite" : "Estimated Per-Visit")}
              </p>
              <p className="mb-2 text-2xl font-extrabold tabular-nums text-gray-900 sm:text-3xl">
                {frequency === "onetime"
                  ? (isFrench ? `${formatMoney(displayPrice)} / premières 30 min` : `${formatMoney(displayPrice)} / first 30 mins`)
                  : `${formatMoney(displayPrice)}${isFrench ? "/visite" : "/visit"}`}
              </p>
              <div className="mt-3 rounded-2xl bg-white/75 p-3 shadow-sm text-left">
                {frequency !== "onetime" ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {isFrench ? "Total mensuel estimé" : "Estimated monthly total"}
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums text-brand-green sm:text-4xl">
                      {formatMoney(monthlyTotal)}
                      <span className="ml-1 text-lg font-semibold text-gray-600 sm:text-xl">
                        {isFrench ? "/mois" : "/month"}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {isFrench ? "Tarification selon le temps" : "Time-based pricing"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isFrench
                        ? "+5 $ par bloc additionnel de 5 minutes après les 30 premières minutes."
                        : "+$5 per additional 5-minute block after the first 30 minutes."}
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-brand-green sm:text-base">
                {pricingDetails.note}
              </p>

            </div>

            <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              {isFrench
                ? "C’est la façon la plus rapide de voir si le service entre dans votre budget et de passer à l’étape suivante. Le prix final est confirmé après vérification."
                : "This is the fastest way to see if the service fits your budget and lock in your next step. Final pricing is confirmed after we review your request."}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
              {bookingStatus !== "success" && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">1</span>
                      {isFrench ? "Vérifier la zone desservie" : "Check service area"}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={`postal-code-${idPrefix}`} className="text-sm font-semibold text-gray-700">
                        {isFrench ? "Code postal" : "Postal code"}
                      </label>
                      <input
                        id={`postal-code-${idPrefix}`}
                        type="text"
                        name="postalCode"
                        placeholder="H7A 1A1"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          setPostalStatus("idle");
                          setConsentError("");
                        }}
                        autoComplete="postal-code"
                        inputMode="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                        required
                      />
                    </div>
                    <div className="rounded-xl border border-[#d7e6da] bg-[#f7faf7] p-4">
                      <label className="flex items-start gap-3 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={consentChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setConsentChecked(checked);
                            setConsentError("");
                            if (!checked) {
                              setPostalStatus("idle");
                            }
                          }}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                        />
                        <span>
                          {isFrench ? "J’accepte les " : "I agree to the "}
                          <Link href={isFrench ? "/fr/terms" : "/terms"} className="font-semibold text-brand-green hover:underline">
                            {isFrench ? "conditions" : "Terms"}
                          </Link>
                          {isFrench ? " et la " : " and "}
                          <Link href={isFrench ? "/fr/privacy" : "/privacy"} className="font-semibold text-brand-green hover:underline">
                            {isFrench ? "politique de confidentialité" : "Privacy Policy"}
                          </Link>
                          {isFrench
                            ? " et j’autorise Ca-Ca Canin à me contacter au sujet de ma demande de devis."
                            : " and allow Ca-Ca Canin to contact me about my quote request."}
                        </span>
                      </label>
                      {consentError && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {consentError}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-brand-green text-white hover:bg-brand-green-dark"
                      onClick={handlePostalCodeCheck}
                    >
                      {isFrench ? "Vérifier" : "Check availability"}
                    </Button>
                    {postalStatus === "valid" && (
                      <div className="text-sm text-brand-green" role="status" aria-live="polite">
                        {isFrench
                          ? "Nous desservons ce code postal. Passez à l’étape 2."
                          : "We service that postal code. Continue to step 2."}
                      </div>
                    )}
                    {postalStatus === "out_of_area" && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800" role="status" aria-live="polite">
                        {isFrench
                          ? "Ce code postal est hors de notre zone habituelle, mais laissez vos coordonnées et on vous contactera si on s’étend dans votre secteur."
                          : "That postal code is outside our usual area, but leave your info and we’ll reach out if we expand to your area."}
                      </div>
                    )}
                    {postalStatus === "invalid" && (
                      <div className="text-sm text-red-600" role="status" aria-live="polite">
                        {isFrench ? "Veuillez entrer un code postal canadien valide." : "Please enter a valid Canadian postal code."}
                      </div>
                    )}
                  </div>

                  {(postalStatus === "valid" || postalStatus === "out_of_area") && (
                    <>
                      <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor={`website-field-${idPrefix}`}>{isFrench ? "Laisser ce champ vide" : "Leave this field empty"}</label>
                          <input
                            id={`website-field-${idPrefix}`}
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={websiteField}
                            onChange={(e) => setWebsiteField(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">2</span>
                          {postalStatus === "out_of_area"
                            ? (isFrench ? "Laissez vos coordonnées" : "Leave your contact info")
                            : (isFrench ? "Vos coordonnées" : "Your contact information")}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="space-y-1">
                            <label htmlFor={`name-${idPrefix}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Nom" : "Name"}
                            </label>
                            <input
                              id={`name-${idPrefix}`}
                              type="text"
                              name="name"
                              placeholder={isFrench ? "Jean Dupont" : "Jane Doe"}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              autoComplete="name"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor={`phone-${idPrefix}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Téléphone" : "Phone number"}
                            </label>
                            <input
                              id={`phone-${idPrefix}`}
                              type="tel"
                              name="phone"
                              placeholder="438 880 8922"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              autoComplete="tel"
                              inputMode="tel"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor={`email-${idPrefix}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Courriel" : "Email"}
                            </label>
                            <input
                              id={`email-${idPrefix}`}
                              type="email"
                              name="email"
                              placeholder={isFrench ? "vous@courriel.com" : "you@email.com"}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-lg py-3"
                        disabled={bookingStatus === "loading"}
                      >
                        {bookingStatus === "loading"
                          ? (isFrench ? "Envoi..." : "Sending...")
                          : (isFrench ? "Obtenir mon devis" : "Get My Quote")}
                      </Button>
                      {bookingStatus === "error" && (
                        <div className="text-sm text-red-600" role="status" aria-live="polite">
                          {bookingMessage}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        {isFrench ? "Nous répondons habituellement en 1 jour ouvrable." : "We usually reply within 1 business day."}
                      </p>
                    </>
                  )}
                </>
              )}

              {bookingStatus === "success" && (
                <div
                  id={`quote-thank-you-${idPrefix}`}
                  tabIndex={-1}
                  className="rounded-2xl border border-brand-green/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)] outline-none"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
                    {isFrench ? "Merci" : "Thank you"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {isFrench ? "Votre demande de devis est envoyée." : "Your quote request is in."}
                  </h3>
                  <p className="mt-3 text-base text-gray-600">
                    {isFrench
                      ? "Vous êtes un pas plus près d’une cour propre. Nous vous contacterons sous peu, généralement dans un délai d’un jour ouvrable."
                      : "You are one step closer to a clean yard. We will follow up shortly, usually within 1 business day."}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {isFrench ? "Vous ne l’avez pas reçu? Vérifiez vos courriels indésirables." : "Didn't receive it? Check your junk folder."}
                  </p>
                  <p className="mt-4 text-sm text-brand-green">{bookingMessage}</p>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
