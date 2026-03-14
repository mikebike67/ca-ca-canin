'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ContactFormProps = {
  locale?: "en" | "fr";
};

export default function ContactForm({ locale = "en" }: ContactFormProps) {
  const isFrench = locale === "fr";
  const thankYouRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const copy = {
    title: isFrench ? "Envoyer un message" : "Send a message",
    subtitle: isFrench
      ? "Utilisez ce formulaire pour les devis, les questions de zone de service ou toute autre demande."
      : "Use this form for quotes, service-area questions, or general requests.",
    name: isFrench ? "Nom" : "Name",
    email: isFrench ? "Courriel" : "Email",
    phone: isFrench ? "Telephone" : "Phone",
    message: isFrench ? "Message" : "Message",
    consent: isFrench
      ? "J'accepte les conditions et la politique de confidentialite et j'autorise Ca-Ca Canin a me contacter au sujet de ma demande."
      : "I agree to the Terms and Privacy Policy and allow Ca-Ca Canin to contact me about my request.",
    submit: isFrench ? "Envoyer mon message" : "Send my message",
    sending: isFrench ? "Envoi..." : "Sending...",
    success: isFrench
      ? "Votre message a ete envoye. Nous vous repondrons sous peu."
      : "Your message has been sent. We will reply shortly.",
    thankYouEyebrow: isFrench ? "Merci" : "Thank you",
    thankYouTitle: isFrench ? "Votre message a bien ete envoye." : "Your message has been sent.",
    thankYouBody: isFrench
      ? "Nous avons bien recu votre demande et nous vous repondrons sous peu. Inutile de remplir le formulaire une deuxieme fois."
      : "We received your request and will reply shortly. There is no need to fill out the form again.",
    thankYouFoot: isFrench
      ? "Si vous n'avez pas de reponse rapidement, verifiez vos courriels indesirables."
      : "If you do not see our reply quickly, check your junk folder.",
    error: isFrench
      ? "Une erreur s'est produite. Veuillez reessayer."
      : "Something went wrong. Please try again.",
    consentError: isFrench
      ? "Veuillez accepter les conditions et la politique de confidentialite avant l'envoi."
      : "Please agree to the Terms and Privacy Policy before sending.",
    replyTime: isFrench ? "Nous repondons habituellement en 1 jour ouvrable." : "We usually reply within 1 business day.",
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setWebsite("");
    setConsentChecked(false);
    setConsentError("");
  };

  useEffect(() => {
    if (status !== "success" || !thankYouRef.current) return;

    requestAnimationFrame(() => {
      thankYouRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      thankYouRef.current?.focus();
    });
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consentChecked) {
      setConsentError(copy.consentError);
      return;
    }

    setConsentError("");
    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          consent: true,
          website,
          locale,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || copy.error);
      }

      setStatus("success");
      setStatusMessage(copy.success);
      resetForm();
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || copy.error);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[#d7e6da] bg-white p-8 shadow-[0_18px_45px_rgba(48,121,68,0.08)] sm:p-10">
      <div className="mb-6 border-b border-[#d7e6da] pb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 text-base text-gray-600">{copy.subtitle}</p>
      </div>

      {status === "success" ? (
        <div
          id={`contact-thank-you-${locale}`}
          ref={thankYouRef}
          tabIndex={-1}
          className="rounded-2xl border border-[#307944]/20 bg-[#eef7f0] p-6 text-center shadow-[0_18px_45px_rgba(48,121,68,0.08)] outline-none"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307944]">{copy.thankYouEyebrow}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{copy.thankYouTitle}</h3>
          <p className="mt-3 text-base text-gray-600">{copy.thankYouBody}</p>
          <p className="mt-2 text-sm text-gray-600">{copy.thankYouFoot}</p>
          <p className="mt-4 text-sm text-[#307944]">{statusMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`website-field-${locale}`}>Leave this field empty</label>
            <input
              id={`website-field-${locale}`}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor={`contact-name-${locale}`} className="text-sm font-semibold text-gray-700">
                {copy.name}
              </label>
              <input
                id={`contact-name-${locale}`}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#307944]"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={`contact-email-${locale}`} className="text-sm font-semibold text-gray-700">
                {copy.email}
              </label>
              <input
                id={`contact-email-${locale}`}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#307944]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor={`contact-phone-${locale}`} className="text-sm font-semibold text-gray-700">
              {copy.phone}
            </label>
            <input
              id={`contact-phone-${locale}`}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#307944]"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor={`contact-message-${locale}`} className="text-sm font-semibold text-gray-700">
              {copy.message}
            </label>
            <textarea
              id={`contact-message-${locale}`}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#307944]"
              required
            />
          </div>

          <div className="rounded-xl border border-[#d7e6da] bg-[#f7faf7] p-4">
            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setConsentChecked(checked);
                  setConsentError("");
                }}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#307944] focus:ring-[#307944]"
              />
              <span>
                {copy.consent.split("Terms")[0]}
                {isFrench ? (
                  <>
                    <Link href="/fr/terms" className="font-semibold text-[#307944] hover:underline">
                      conditions
                    </Link>{" "}
                    et la{" "}
                    <Link href="/fr/privacy" className="font-semibold text-[#307944] hover:underline">
                      politique de confidentialite
                    </Link>{" "}
                    et j'autorise Ca-Ca Canin a me contacter au sujet de ma demande.
                  </>
                ) : (
                  <>
                    <Link href="/terms" className="font-semibold text-[#307944] hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-[#307944] hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and allow Ca-Ca Canin to contact me about my request.
                  </>
                )}
              </span>
            </label>
            {consentError && <p className="mt-2 text-sm text-red-600">{consentError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-[#307944] px-6 py-3 text-white hover:bg-[#256336]"
            disabled={status === "loading"}
          >
            {status === "loading" ? copy.sending : copy.submit}
          </Button>

          {statusMessage && (
            <div className="text-sm text-red-600" role="status" aria-live="polite">
              {statusMessage}
            </div>
          )}

          <p className="text-xs text-gray-500">{copy.replyTime}</p>
        </form>
      )}
    </section>
  );
}
