import type { Metadata } from "next";
import BlogIndexPage from "@/components/blog-index-page";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog | Dog Waste Removal Tips for Laval & North Shore | Ca-Ca Canin",
  description: "Guides on dog poop removal pricing, yard care, and cleanup tips for homeowners in Laval and the North Shore.",
  alternates: {
    canonical: "/blog",
    languages: {
      en: "/blog",
      fr: "/fr/blogue",
    },
  },
  openGraph: {
    title: "Blog | Dog Waste Removal Tips for Laval & North Shore | Ca-Ca Canin",
    description: "Guides on dog poop removal pricing, yard care, and cleanup tips for homeowners in Laval and the North Shore.",
    type: "website",
    url: "/blog",
    siteName: "Ca-Ca Canin",
    locale: "en_CA",
    images: [
      {
        url: "/images/cacacaninlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Ca-Ca Canin blog",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Blog | Dog Waste Removal Tips for Laval & North Shore | Ca-Ca Canin",
    description: "Guides on dog poop removal pricing, yard care, and cleanup tips for homeowners in Laval and the North Shore.",
    images: ["/images/cacacaninlogo.jpg"],
  },
};

export default function BlogPage() {
  return <BlogIndexPage locale="en" posts={BLOG_POSTS} />;
}
