'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import LegalPageShell from "@/components/legal-page-shell";

const leadTypes = {
  contact: {
    en: {
      label: "Contact request",
      title: "Your message has been sent.",
      body: "We received your request and will reply shortly. There is no need to fill out the form again.",
      next: "If you do not see our reply quickly, check your junk folder.",
      cta: "Back to home",
      ctaHref: "/",
    },
    fr: {
      label: "Message de contact",
      title: "Votre message a bien ete envoye.",
      body: "Nous avons bien recu votre demande et nous vous repondrons sous peu. Inutile de remplir le formulaire une deuxieme fois.",
      next: "Si vous n'avez pas de reponse rapidement, verifiez vos courriels indesirables.",
      cta: "Retour a l'accueil",
      ctaHref: "/fr",
    },
  },
  quote: {
    en: {
      label: "Quote request",
      title: "Your quote request is in.",
      body: "You are one step closer to a clean yard. We will follow up shortly, usually within 1 business day.",
      next: "Didn't receive it? Check your junk folder.",
      cta: "Back to home",
      ctaHref: "/",
    },
    fr: {
      label: "Demande de devis",
      title: "Votre demande de devis est envoyee.",
      body: "Nous avons bien recu votre demande et nous vous contacterons sous peu, generalement dans un delai d'un jour ouvrable.",
      next: "Vous ne l'avez pas recu? Verifiez vos courriels indesirables.",
      cta: "Retour a l'accueil",
      ctaHref: "/fr",
    },
  },
} as const;

type LeadType = keyof typeof leadTypes;
type Locale = "en" | "fr";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const locale: Locale = searchParams.get("lang") === "fr" ? "fr" : "en";
  const typeParam = searchParams.get("type");
  const type: LeadType = typeParam === "contact" ? typeParam : "quote";
  const copy = leadTypes[type][locale];

  return (
    <LegalPageShell locale={locale}>
      <div className="bg-[#f7faf7] px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#d7e6da] bg-white p-8 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7f0] text-brand-green">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
            {locale === "fr" ? "Merci" : "Thank you"}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            {copy.body}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600">
            {copy.next}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={copy.ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark"
            >
              {copy.cta}
            </Link>
            <a
              href="tel:+14388808922"
              className="inline-flex items-center justify-center rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-[#eef7f0]"
            >
              {locale === "fr" ? "Appeler le 438 880 8922" : "Call 438 880 8922"}
            </a>
          </div>
        </section>
      </div>
    </LegalPageShell>
  );
}
