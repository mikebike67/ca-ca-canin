import type { Metadata } from "next";
import BlogIndexPage from "@/components/blog-index-page";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blogue | Conseils sur le ramassage de déjections canines à Laval | Ca-Ca Canin",
  description: "Guides sur les prix du ramassage de déjections canines, l'entretien de la cour et les conseils de nettoyage pour les propriétaires de Laval et de la Rive-Nord.",
  alternates: {
    canonical: "/fr/blogue",
    languages: {
      en: "/blog",
      fr: "/fr/blogue",
    },
  },
  openGraph: {
    title: "Blogue | Conseils sur le ramassage de déjections canines à Laval | Ca-Ca Canin",
    description: "Guides sur les prix du ramassage de déjections canines, l'entretien de la cour et les conseils de nettoyage pour les propriétaires de Laval et de la Rive-Nord.",
    type: "website",
    url: "/fr/blogue",
    siteName: "Ca-Ca Canin",
    locale: "fr_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Blogue Ca-Ca Canin",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Blogue | Conseils sur le ramassage de déjections canines à Laval | Ca-Ca Canin",
    description: "Guides sur les prix du ramassage de déjections canines, l'entretien de la cour et les conseils de nettoyage pour les propriétaires de Laval et de la Rive-Nord.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function BloguePage() {
  return <BlogIndexPage locale="fr" posts={BLOG_POSTS} />;
}
