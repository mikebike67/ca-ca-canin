'use client'

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applyDiscount,
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
const formatDiscountLabel = (type: "flat" | "percent", amount: number) => (type === "percent" ? `${amount}%` : formatMoney(amount));


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
  const [postalError, setPostalError] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [websiteField, setWebsiteField] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralType, setReferralType] = useState<"flat" | "percent">("flat");
  const [referralRecurring, setReferralRecurring] = useState(false);
  const [referralRequiresProof, setReferralRequiresProof] = useState(false);

  const yardCategory = useMemo(() => getYardCategory(yardSqft), [yardSqft]);

  const pricingDetails = useMemo(() => {
    const perVisit = calculateBookingPrice(frequency, dogs, yardSqft);
    return { perVisit, note: frequencyNotes[locale][frequency] };
  }, [dogs, frequency, locale, yardSqft]);

  const monthlyTotal = useMemo(() => {
    const visitsPerMonth = getMonthlyVisits(frequency);
    return Math.round(pricingDetails.perVisit * visitsPerMonth * 100) / 100;
  }, [frequency, pricingDetails.perVisit]);

  const referralDiscountBase = frequency === "onetime" ? pricingDetails.perVisit : monthlyTotal;

  const discountedPrice = useMemo(
    () => (referralStatus === "valid" ? applyDiscount(referralDiscountBase, { type: referralType, amount: referralDiscount }) : null),
    [referralStatus, referralDiscount, referralType, referralDiscountBase],
  );

  const handleApplyReferral = async () => {
    const code = referralCode.trim();
    if (!code) return;

    setReferralStatus("checking");

    try {
      const res = await fetch("/api/validate-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({ valid: false }));

      if (data.valid) {
        setReferralStatus("valid");
        setReferralDiscount(data.discount ?? 0);
        setReferralType(data.type === "percent" ? "percent" : "flat");
        setReferralRecurring(Boolean(data.recurring));
        setReferralRequiresProof(Boolean(data.requiresProof));
      } else {
        setReferralStatus("invalid");
        setReferralDiscount(0);
        setReferralType("flat");
        setReferralRecurring(false);
        setReferralRequiresProof(false);
      }
    } catch {
      setReferralStatus("invalid");
      setReferralDiscount(0);
      setReferralType("flat");
      setReferralRecurring(false);
      setReferralRequiresProof(false);
    }
  };

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

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;

    if (!consentChecked) {
      setConsentError(
        isFrench
          ? "Veuillez accepter les conditions et la politique de confidentialité pour continuer."
          : "Please agree to the Terms and Privacy Policy to continue.",
      );
      hasError = true;
    } else {
      setConsentError("");
    }

    const normalized = normalizePostalCode(postalCode);
    if (!isCanadianPostalCode(normalized)) {
      setPostalError(
        isFrench ? "Veuillez entrer un code postal canadien valide." : "Please enter a valid Canadian postal code.",
      );
      hasError = true;
    } else {
      setPostalError("");
    }

    if (hasError) return;

    setBookingStatus("loading");
    setBookingMessage("");

    const outOfArea = !isRegularServicePostalCode(normalized);

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
          postalCode: normalized,
          frequency,
          dogs,
          yardSqft,
          price: pricingDetails.perVisit,
          outOfArea,
          referralCode: referralStatus === "valid" ? referralCode.trim() : undefined,
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
      setPostalError("");
      setWebsiteField("");
      setReferralCode("");
      setReferralStatus("idle");
      setReferralDiscount(0);
      setReferralType("flat");
      setReferralRecurring(false);
      setReferralRequiresProof(false);
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
          {/* LEFT: Selectors + price preview */}
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

            {/* Price preview */}
            <div className="rounded-2xl border border-brand-green/15 bg-[#eef7f0] p-5 text-center lg:text-left shadow-[0_18px_45px_rgba(48,121,68,0.08)]">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                {frequency === "onetime"
                  ? (isFrench ? "Visite estimée" : "Estimated Visit")
                  : (isFrench ? "Estimation par visite" : "Estimated Per-Visit")}
              </p>
              {frequency === "onetime" && referralStatus === "valid" && discountedPrice !== null ? (
                <p className="mb-2 flex flex-wrap items-baseline justify-center gap-2 lg:justify-start">
                  <span className="text-lg font-semibold text-gray-400 line-through">
                    {formatMoney(displayPrice)}
                  </span>
                  <span className="text-2xl font-extrabold tabular-nums text-brand-green sm:text-3xl">
                    {isFrench ? `${formatMoney(discountedPrice)} / premières 30 min` : `${formatMoney(discountedPrice)} / first 30 mins`}
                  </span>
                </p>
              ) : (
                <p className="mb-2 text-2xl font-extrabold tabular-nums text-gray-900 sm:text-3xl">
                  {frequency === "onetime"
                    ? (isFrench ? `${formatMoney(displayPrice)} / premières 30 min` : `${formatMoney(displayPrice)} / first 30 mins`)
                    : `${formatMoney(displayPrice)}${isFrench ? "/visite" : "/visit"}`}
                </p>
              )}
              <div className="mt-3 rounded-2xl bg-white/75 p-3 shadow-sm text-left">
                {frequency !== "onetime" ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                      {isFrench ? "Total mensuel estimé" : "Estimated monthly total"}
                    </p>
                    {referralStatus === "valid" && discountedPrice !== null ? (
                      <>
                        <p className="flex flex-wrap items-baseline gap-2">
                          <span className="text-lg font-semibold text-gray-400 line-through">
                            {formatMoney(monthlyTotal)}
                          </span>
                          <span className="text-2xl font-extrabold tabular-nums text-brand-green sm:text-4xl">
                            {formatMoney(discountedPrice)}
                            <span className="ml-1 text-lg font-semibold text-gray-600 sm:text-xl">
                              {referralRecurring
                                ? (isFrench ? "chaque mois" : "every month")
                                : (isFrench ? "ce mois-ci" : "this month")}
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
                      <p className="text-2xl font-extrabold tabular-nums text-brand-green sm:text-4xl">
                        {formatMoney(monthlyTotal)}
                        <span className="ml-1 text-lg font-semibold text-gray-600 sm:text-xl">
                          {isFrench ? "/mois" : "/month"}
                        </span>
                      </p>
                    )}
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

              <div className="mt-4 border-t border-brand-green/10 pt-4">
                <label htmlFor={`referral-code-${idPrefix}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/80">
                  {isFrench ? "Code de parrainage ou de partenaire (optionnel)" : "Referral or partner code (optional)"}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id={`referral-code-${idPrefix}`}
                    type="text"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value);
                      setReferralStatus("idle");
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
                      ? (isFrench ? "..." : "...")
                      : (isFrench ? "Appliquer" : "Apply")}
                  </Button>
                </div>
                {referralStatus === "valid" && discountedPrice !== null && (
                  <p className="mt-2 text-sm font-semibold text-brand-green" role="status" aria-live="polite">
                    {frequency === "onetime"
                      ? (isFrench
                          ? `Code appliqué : ${formatDiscountLabel(referralType, referralDiscount)} de rabais sur votre visite → ${formatMoney(discountedPrice)}`
                          : `Code applied: ${formatDiscountLabel(referralType, referralDiscount)} off your visit → ${formatMoney(discountedPrice)}`)
                      : referralRecurring
                        ? (isFrench
                            ? `Code appliqué : ${formatDiscountLabel(referralType, referralDiscount)} de rabais chaque mois → ${formatMoney(discountedPrice)}`
                            : `Code applied: ${formatDiscountLabel(referralType, referralDiscount)} off every month → ${formatMoney(discountedPrice)}`)
                        : (isFrench
                            ? `Code appliqué : ${formatDiscountLabel(referralType, referralDiscount)} de rabais sur votre premier mois → ${formatMoney(discountedPrice)}`
                            : `Code applied: ${formatDiscountLabel(referralType, referralDiscount)} off your first month → ${formatMoney(discountedPrice)}`)}
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

          {/* RIGHT: Form */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#d7e6da] bg-white p-4 text-sm text-gray-600 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
              {isFrench
                ? "C’est la façon la plus rapide de voir si le service entre dans votre budget et de passer à l’étape suivante. Le prix final est confirmé après vérification."
                : "This is the fastest way to see if the service fits your budget and lock in your next step. Final pricing is confirmed after we review your request."}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-2xl border border-[#d7e6da] bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.05)]">
              {bookingStatus !== "success" && (
                <>
                  <p className="text-sm font-semibold text-brand-green">
                    {isFrench ? "Vos coordonnées" : "Your contact information"}
                  </p>

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

                  <div className="space-y-3">
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
                          setPostalError("");
                        }}
                        autoComplete="postal-code"
                        inputMode="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                        required
                      />
                      {postalError && (
                        <p className="text-sm text-red-600" role="alert">
                          {postalError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#d7e6da] bg-[#f7faf7] p-4">
                    <label className="flex items-start gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => {
                          setConsentChecked(e.target.checked);
                          setConsentError("");
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
