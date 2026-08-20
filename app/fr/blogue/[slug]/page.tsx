import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/components/blog-post-page";
import { BLOG_POSTS, getBlogPostBySlugFr } from "@/lib/blog-posts";

type BlogueSlugPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slugFr }));
}

export function generateMetadata({ params }: BlogueSlugPageProps): Metadata {
  const post = getBlogPostBySlugFr(params.slug);

  if (!post) return {};

  return {
    title: `${post.titleFr} | Ca-Ca Canin`,
    description: post.metaDescriptionFr,
    keywords: post.keywordsFr,
    alternates: {
      canonical: `/fr/blogue/${post.slugFr}`,
      languages: {
        en: `/blog/${post.slug}`,
        fr: `/fr/blogue/${post.slugFr}`,
      },
    },
    openGraph: {
      title: `${post.titleFr} | Ca-Ca Canin`,
      description: post.metaDescriptionFr,
      type: "article",
      url: `/fr/blogue/${post.slugFr}`,
      siteName: "Ca-Ca Canin",
      locale: "fr_CA",
      images: [
        {
          url: "/images/cacacaninlogo.jpg",
          width: 1200,
          height: 630,
          alt: post.titleFr,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${post.titleFr} | Ca-Ca Canin`,
      description: post.metaDescriptionFr,
      images: ["/images/cacacaninlogo.jpg"],
    },
  };
}

export default function BlogueSlugPage({ params }: BlogueSlugPageProps) {
  const post = getBlogPostBySlugFr(params.slug);

  if (!post) notFound();

  return <BlogPostPage locale="fr" post={post} />;
}
