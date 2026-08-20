'use client'

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getRegularServiceLocationBySlug } from "@/lib/regular-service-area";
import type { BlogBlock, BlogImageCredit, BlogPost } from "@/lib/blog-posts";

const siteUrl = "https://cacacanin.com";

type BlogPostPageProps = {
  locale: "en" | "fr";
  post: BlogPost;
};

function formatDate(isoDate: string, isFrench: boolean) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(isFrench ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ImageCredit({ credit }: { credit: BlogImageCredit }) {
  return (
    <a
      href={credit.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="mt-1 block text-center text-xs text-gray-400 underline decoration-gray-300 underline-offset-2 hover:text-brand-green hover:decoration-brand-green"
    >
      Photo: {credit.photographer} / Pexels
    </a>
  );
}

function BlockRenderer({ block, isFrench, quoteHref }: { block: BlogBlock; isFrench: boolean; quoteHref: string }) {
  switch (block.type) {
    case "heading": {
      const text = isFrench ? block.textFr : block.textEn;
      if (block.level === 3) {
        return <h3 className="mb-3 mt-8 text-xl font-bold text-gray-900 sm:text-2xl">{text}</h3>;
      }
      return <h2 className="mb-4 mt-10 text-2xl font-bold text-gray-900 sm:text-3xl">{text}</h2>;
    }
    case "paragraph":
      return <p className="mb-5 text-base leading-8 text-gray-700 sm:text-lg">{isFrench ? block.textFr : block.textEn}</p>;
    case "list": {
      const items = isFrench ? block.itemsFr : block.itemsEn;
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className={`mb-6 space-y-2 pl-6 text-base leading-7 text-gray-700 sm:text-lg ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "image":
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-3xl border border-[#d7e6da]">
            <Image
              src={block.src}
              alt={isFrench ? block.altFr : block.alt}
              width={block.width}
              height={block.height}
              className="h-auto w-full object-cover"
            />
          </div>
          {(block.captionEn || block.captionFr) && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {isFrench ? block.captionFr : block.captionEn}
            </figcaption>
          )}
          <ImageCredit credit={block.credit} />
        </figure>
      );
    case "callout":
      return (
        <div className="my-8 rounded-3xl border border-brand-green/20 bg-[#eef7f0] p-6 sm:p-8">
          <h3 className="mb-2 text-lg font-bold text-gray-900">{isFrench ? block.titleFr : block.titleEn}</h3>
          <p className="mb-4 leading-7 text-gray-700">{isFrench ? block.bodyFr : block.bodyEn}</p>
          <Button className="rounded-full bg-brand-green text-white hover:bg-brand-green-dark" asChild>
            <Link href={quoteHref}>{isFrench ? "Vérifier ma disponibilité" : "Check Availability"}</Link>
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ locale, post }: BlogPostPageProps) {
  const isFrench = locale === "fr";
  const homeHref = isFrench ? "/fr" : "/";
  const blogHref = isFrench ? "/fr/blogue" : "/blog";
  const altHref = isFrench ? `/blog/${post.slug}` : `/fr/blogue/${post.slugFr}`;
  const postHref = isFrench ? `/fr/blogue/${post.slugFr}` : `/blog/${post.slug}`;
  const contactHref = isFrench ? "/fr/contact" : "/contact";

  const location = post.locationSlug ? getRegularServiceLocationBySlug(post.locationSlug) : undefined;
  const locationHref = location
    ? isFrench
      ? `/fr/ramassage-dejections/${location.slug}`
      : `/dog-poop-cleanup/${location.slug}`
    : isFrench
      ? "/fr/ramassage-dejections"
      : "/dog-poop-cleanup";
  const quoteHref = `${locationHref}#quote-form`;

  const title = isFrench ? post.titleFr : post.titleEn;
  const excerpt = isFrench ? post.excerptFr : post.excerptEn;
  const categoryLabel = isFrench
    ? post.category === "local"
      ? "Guide local"
      : "Guide général"
    : post.category === "local"
      ? "Local guide"
      : "General guide";

  const breadcrumbItems = [
    { name: isFrench ? "Accueil" : "Home", url: `${siteUrl}${homeHref}` },
    { name: isFrench ? "Blogue" : "Blog", url: `${siteUrl}${blogHref}` },
    { name: title, url: `${siteUrl}${postHref}` },
  ];

  return (
    <div lang={isFrench ? "fr" : "en"} className="flex min-h-screen flex-col bg-white text-gray-900">
      <SiteHeader locale={locale} altHref={altHref} ctaLabel={isFrench ? "Vérifier ma disponibilité" : "Check Availability"} ctaHref={quoteHref} />

      <main id="main-content" className="flex-1 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BlogPosting",
                  headline: title,
                  description: isFrench ? post.metaDescriptionFr : post.metaDescriptionEn,
                  datePublished: post.publishedAt,
                  dateModified: post.updatedAt ?? post.publishedAt,
                  image: `${siteUrl}${post.heroImage.src}`,
                  mainEntityOfPage: `${siteUrl}${postHref}`,
                  author: { "@type": "Organization", name: "Ca-Ca Canin" },
                  publisher: {
                    "@type": "LocalBusiness",
                    name: "Ca-Ca Canin",
                    telephone: "+1-438-880-8922",
                    url: siteUrl,
                  },
                },
                ...(post.faq && post.faq.length > 0
                  ? [
                      {
                        "@type": "FAQPage",
                        mainEntity: post.faq.map((item) => ({
                          "@type": "Question",
                          name: isFrench ? item.qFr : item.qEn,
                          acceptedAnswer: { "@type": "Answer", text: isFrench ? item.aFr : item.aEn },
                        })),
                      },
                    ]
                  : []),
                {
                  "@type": "BreadcrumbList",
                  itemListElement: breadcrumbItems.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: item.url,
                  })),
                },
              ],
            }),
          }}
        />

        <article className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <nav aria-label={isFrench ? "Fil d'Ariane" : "Breadcrumb"} className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <li>
                  <Link href={homeHref} className="hover:text-brand-green">
                    {isFrench ? "Accueil" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={blogHref} className="hover:text-brand-green">
                    {isFrench ? "Blogue" : "Blog"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-gray-700">{title}</li>
              </ol>
            </nav>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">{categoryLabel}</p>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mb-6 text-lg text-gray-600">{excerpt}</p>
            <p className="mb-8 text-sm text-gray-500">
              {isFrench ? "Publié le" : "Published"} {formatDate(post.publishedAt, isFrench)}
            </p>

            <div className="mb-10">
              <div className="overflow-hidden rounded-3xl border border-[#d7e6da]">
                <Image
                  src={post.heroImage.src}
                  alt={isFrench ? post.heroImage.altFr : post.heroImage.alt}
                  width={post.heroImage.width}
                  height={post.heroImage.height}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
              <ImageCredit credit={post.heroImage.credit} />
            </div>

            <div>
              {post.body.map((block, index) => (
                <BlockRenderer key={index} block={block} isFrench={isFrench} quoteHref={quoteHref} />
              ))}
            </div>

            {post.faq && post.faq.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {isFrench ? "Questions fréquentes" : "Frequently asked questions"}
                </h2>
                <div className="space-y-4">
                  {post.faq.map((item) => (
                    <Card key={item.qEn} className="border border-[#d7e6da] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                      <CardHeader>
                        <CardTitle className="text-lg">{isFrench ? item.qFr : item.qEn}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-7 text-gray-600">{isFrench ? item.aFr : item.aEn}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {post.sources && post.sources.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {isFrench ? "Sources" : "Sources"}
                </h2>
                <ul className="space-y-1.5 text-sm text-gray-500">
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="underline decoration-gray-300 underline-offset-2 hover:text-brand-green hover:decoration-brand-green"
                      >
                        {isFrench ? source.labelFr : source.labelEn}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-12 rounded-3xl border border-[#d7e6da] bg-gray-50 p-8 text-center">
              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                {isFrench ? "Prêt à réserver?" : "Ready to book?"}
              </h2>
              <p className="mb-6 text-gray-600">
                {isFrench
                  ? "Obtenez votre prix exact en moins d'une minute, sans engagement."
                  : "Get your exact price in under a minute, no commitment required."}
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={contactHref}
                  className="rounded-full border-2 border-brand-green px-6 py-3 font-semibold text-brand-green transition-colors hover:bg-[#eef7f0]"
                >
                  {isFrench ? "Nous contacter" : "Contact us"}
                </Link>
                <Link
                  href={quoteHref}
                  className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-green-dark"
                >
                  {isFrench ? "Vérifier ma disponibilité" : "Check Availability"}
                </Link>
              </div>
            </section>

            {location && (
              <Link
                href={locationHref}
                className="mt-6 block rounded-3xl border border-[#d7e6da] bg-white p-6 shadow-[0_18px_45px_rgba(17,24,39,0.05)] transition-all hover:-translate-y-1 hover:border-brand-green/40"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
                  {isFrench ? "Service à" : "Service in"} {isFrench ? location.nameFr : location.name}
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {isFrench ? location.regularPrimaryKeywordFr : location.regularPrimaryKeywordEn}
                </h3>
                <p className="mt-3 text-gray-600">{isFrench ? location.regularIntroFr : location.regularIntroEn}</p>
              </Link>
            )}
          </div>
        </article>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
