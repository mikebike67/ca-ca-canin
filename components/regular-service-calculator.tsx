'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Montserrat } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

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
};

export default function RegularServiceCalculator({ locale }: RegularServiceCalculatorProps) {
  const isFrench = locale === "fr";
  const quoteThankYouRef = useRef<HTMLDivElement | null>(null);
  const [frequency, setFrequency] = useState<ServiceFrequency>("weekly");
  const [dogs, setDogs] = useState<DogCount>("1");
  const [yardSqft, setYardSqft] = useState(3000);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [postalCode, setPostalCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalStatus, setPostalStatus] = useState<"idle" | "valid" | "invalid">("idle");
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

  useEffect(() => {
    if (bookingStatus !== "success" || !quoteThankYouRef.current) return;

    requestAnimationFrame(() => {
      quoteThankYouRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      quoteThankYouRef.current?.focus();
    });
  }, [bookingStatus]);

  const handlePostalCodeCheck = () => {
    const normalized = normalizePostalCode(postalCode);

    if (!isCanadianPostalCode(normalized)) {
      setPostalStatus("invalid");
      setBookingStatus("idle");
      setBookingMessage("");
      return;
    }

    if (!isRegularServicePostalCode(normalized)) {
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
      setPostalStatus("idle");
      return;
    }

    setConsentError("");
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

    if (!isCanadianPostalCode(postalCode) || !isRegularServicePostalCode(postalCode)) {
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
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || (isFrench ? "Échec de l'envoi de la confirmation." : "Failed to send confirmation."),
        );
      }

      setBookingStatus("success");
      setBookingMessage(
        isFrench
          ? "Courriel de confirmation envoyé! Nous vous contacterons sous peu."
          : "Confirmation email sent! We will follow up shortly.",
      );
      setPostalCode("");
      setName("");
      setPhone("");
      setEmail("");
      setConsentChecked(false);
      setConsentError("");
      setPostalStatus("idle");
      setWebsiteField("");
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
        <h2 className={`text-3xl md:text-4xl font-bold mb-3 text-gray-900 ${montserrat.className}`}>
          {isFrench ? "Vérifiez votre disponibilité et voyez votre prix" : "Check Availability and See Your Price"}
        </h2>
        <p className="text-lg text-gray-600">
          {isFrench
            ? "Choisissez la taille de votre cour, le nombre de chiens et la fréquence pour obtenir une estimation réelle et demander le service tout de suite."
            : "Pick your yard size, dog count, and schedule to get a real estimate and request service right away."}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="grid min-w-0 gap-6 md:grid-cols-3">
          <div className="order-2 min-w-0 space-y-4 md:order-1 md:col-span-1">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{isFrench ? "Fréquence" : "Frequency"}</p>
              {isFrench ? (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "weekly", label: "Hebdomadaire" },
                    { key: "biweekly", label: "Aux deux semaines" },
                    { key: "monthly", label: "Mensuel" },
                    { key: "onetime", label: "Ponctuel" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setFrequency(item.key as ServiceFrequency)}
                      className={`min-h-[44px] min-w-0 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        frequency === item.key
                          ? "bg-brand-green text-white border-brand-green shadow-md"
                          : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                      }`}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex min-w-0 flex-wrap gap-2">
                    {[
                      { key: "weekly", label: "Weekly" },
                      { key: "biweekly", label: "Bi-Weekly" },
                      { key: "monthly", label: "Monthly" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setFrequency(item.key as ServiceFrequency)}
                        className={`min-h-[44px] min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:flex-none ${
                          frequency === item.key
                            ? "bg-brand-green text-white border-brand-green shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                        }`}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex min-w-0">
                    <button
                      onClick={() => setFrequency("onetime")}
                      className={`min-h-[44px] min-w-0 w-full rounded-lg border px-3 py-2 text-sm font-semibold transition sm:w-auto ${
                        frequency === "onetime"
                          ? "bg-brand-green text-white border-brand-green shadow-md"
                          : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                      }`}
                      type="button"
                    >
                      One-Time
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{isFrench ? "Nombre de chiens" : "Number of Dogs"}</p>
              <div className="flex min-w-0 flex-wrap gap-2">
                {[
                  { key: "1", label: isFrench ? "1 chien" : "1 Dog" },
                  { key: "2", label: isFrench ? "2 chiens" : "2 Dogs" },
                  { key: "3plus", label: isFrench ? "3+ chiens" : "3+ Dogs" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setDogs(item.key as DogCount)}
                    className={`min-h-[44px] min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition sm:flex-none ${
                      dogs === item.key
                        ? "bg-brand-green text-white border-brand-green shadow-md"
                        : "border-gray-200 text-gray-700 hover:border-brand-green hover:text-brand-green"
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor={`yard-size-${locale}`} className="text-sm font-semibold text-gray-700 mb-2 block">
                {isFrench ? "Taille de la cour (pi²)" : "Yard Size (sq ft)"}
              </label>
              <div className="space-y-2">
                <input
                  id={`yard-size-${locale}`}
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
                <div className="flex min-w-0 flex-col gap-2 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold text-brand-green">
                    {yardSqft >= 10000
                      ? (isFrench ? "10 000+ pi²" : "10,000+ sq ft")
                      : (isFrench ? `${yardSqft.toLocaleString()} pi²` : `${yardSqft.toLocaleString()} sq ft`)}
                  </span>
                  <span className="inline-flex max-w-full rounded-full border border-brand-green/20 bg-[#eef7f0] px-3 py-1 text-xs font-semibold text-brand-green">
                    {yardOptions[locale].find((option) => option.key === yardCategory)?.label} · {yardOptions[locale].find((option) => option.key === yardCategory)?.detail}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 min-w-0 md:order-2 md:col-span-2">
            <div className="mx-auto min-w-0 w-full max-w-full rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-center md:max-w-[26rem] md:text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
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
              <div className="mt-3 min-w-0 rounded-2xl bg-white/75 p-3 shadow-sm md:text-left">
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
          </div>

          <div className="order-3 flex flex-col gap-4 md:col-span-2 md:col-start-2">
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
                      <label htmlFor={`postal-code-${locale}`} className="text-sm font-semibold text-gray-700">
                        {isFrench ? "Code postal" : "Postal code"}
                      </label>
                      <input
                        id={`postal-code-${locale}`}
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
                    {postalStatus === "invalid" && (
                      <div className="text-sm text-red-600" role="status" aria-live="polite">
                        {postalCode && !isCanadianPostalCode(postalCode)
                          ? (isFrench ? "Veuillez entrer un code postal canadien valide." : "Please enter a valid Canadian postal code.")
                          : (
                            <>
                              {isFrench
                                ? "Désolé, ce code postal est hors de notre zone de service régulière. "
                                : "Sorry, that postal code is outside our regular service area. "}
                              <Link href={isFrench ? "/fr/contact" : "/contact"} className="font-semibold underline">
                                {isFrench ? "Contactez-nous" : "Reach out to us"}
                              </Link>
                              .
                            </>
                          )}
                      </div>
                    )}
                  </div>

                  {postalStatus === "valid" && (
                    <>
                      <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor={`website-field-${locale}`}>{isFrench ? "Laisser ce champ vide" : "Leave this field empty"}</label>
                          <input
                            id={`website-field-${locale}`}
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
                          {isFrench ? "Vos coordonnées" : "Your contact information"}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          <div className="space-y-1">
                            <label htmlFor={`name-${locale}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Nom" : "Name"}
                            </label>
                            <input
                              id={`name-${locale}`}
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
                            <label htmlFor={`phone-${locale}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Téléphone" : "Phone number"}
                            </label>
                            <input
                              id={`phone-${locale}`}
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
                            <label htmlFor={`email-${locale}`} className="text-sm font-semibold text-gray-700">
                              {isFrench ? "Courriel" : "Email"}
                            </label>
                            <input
                              id={`email-${locale}`}
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
                  id={`quote-thank-you-${locale}`}
                  ref={quoteThankYouRef}
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

              {bookingStatus !== "success" && (
                <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-4 shadow-[0_14px_34px_rgba(48,121,68,0.12)] md:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                    {frequency === "onetime"
                      ? (isFrench ? "Visite estimée" : "Estimated Visit")
                      : (isFrench ? "Prix en direct" : "Live Price")}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="min-w-[9rem] text-2xl font-extrabold tabular-nums text-gray-900">
                      {frequency === "onetime"
                        ? `${formatMoney(displayPrice)}+`
                        : `${formatMoney(displayPrice)}${isFrench ? "/visite" : "/visit"}`}
                    </p>
                    {frequency !== "onetime" && (
                      <p className="min-w-[7rem] text-right text-sm font-semibold tabular-nums text-brand-green">
                        {formatMoney(monthlyTotal)}{isFrench ? "/mois" : "/month"}
                      </p>
                    )}
                  </div>
                  {frequency === "onetime" && (
                    <p className="mt-2 text-sm text-gray-600">
                      {isFrench
                        ? "+5 $ toutes les 5 minutes additionnelles après les 30 premières minutes."
                        : "+$5 every additional 5 minutes after the first 30 minutes."}
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
