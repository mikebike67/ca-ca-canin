'use client'

import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import type { BlogPost } from "@/lib/blog-posts";

type BlogIndexPageProps = {
  locale: "en" | "fr";
  posts: readonly BlogPost[];
};

function formatDate(isoDate: string, isFrench: boolean) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(isFrench ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({ post, isFrench }: { post: BlogPost; isFrench: boolean }) {
  const href = isFrench ? `/fr/blogue/${post.slugFr}` : `/blog/${post.slug}`;
  const categoryLabel = isFrench
    ? post.category === "local"
      ? "Guide local"
      : "Guide général"
    : post.category === "local"
      ? "Local guide"
      : "General guide";
  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-3xl border border-brand-border bg-white shadow-brand-xs transition-all hover:-translate-y-1 hover:border-brand-green/40"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <Image
          src={post.heroImage.src}
          alt={isFrench ? post.heroImage.altFr : post.heroImage.alt}
          width={post.heroImage.width}
          height={post.heroImage.height}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-green">
            {categoryLabel}
          </span>
          <span className="text-xs text-gray-400">{formatDate(post.publishedAt, isFrench)}</span>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">{isFrench ? post.titleFr : post.titleEn}</h3>
        <p className="text-gray-600">{isFrench ? post.excerptFr : post.excerptEn}</p>
      </div>
    </Link>
  );
}

export default function BlogIndexPage({ locale, posts }: BlogIndexPageProps) {
  const isFrench = locale === "fr";
  const homeHref = isFrench ? "/fr" : "/";
  const altHref = isFrench ? "/blog" : "/fr/blogue";

  const localPosts = posts.filter((post) => post.category === "local");
  const generalPosts = posts.filter((post) => post.category === "general");

  return (
    <div lang={isFrench ? "fr" : "en"} className="flex min-h-screen flex-col bg-white text-gray-900">
      <SiteHeader locale={locale} altHref={altHref} />

      <main id="main-content" className="flex-1 pt-16">
        <section className="bg-brand-green-light px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <nav aria-label={isFrench ? "Fil d'Ariane" : "Breadcrumb"} className="mb-6">
              <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                <li>
                  <Link href={homeHref} className="hover:text-brand-green">
                    {isFrench ? "Accueil" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-semibold text-gray-700">{isFrench ? "Blogue" : "Blog"}</li>
              </ol>
            </nav>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-green">
              {isFrench ? "Blogue" : "Blog"}
            </p>
            <h1 className="mb-5 font-heading text-4xl font-bold text-gray-900 md:text-5xl">
              {isFrench ? "Conseils pour propriétaires de chiens" : "Guides for dog owners"}
            </h1>
            <p className="text-lg text-gray-600">
              {isFrench
                ? "Réponses claires sur les prix, l'entretien de la cour et le ramassage de déjections canines à Laval et sur la Rive-Nord."
                : "Straight answers on pricing, yard care, and dog waste removal in Laval and the North Shore."}
            </p>
          </div>
        </section>

        {localPosts.length > 0 && (
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
                {isFrench ? "Guides locaux" : "Local guides"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {localPosts.map((post) => (
                  <PostCard key={post.slug} post={post} isFrench={isFrench} />
                ))}
              </div>
            </div>
          </section>
        )}

        {generalPosts.length > 0 && (
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
                {isFrench ? "Guides généraux" : "General guides"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {generalPosts.map((post) => (
                  <PostCard key={post.slug} post={post} isFrench={isFrench} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
