import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/components/blog-post-page";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-posts";

type BlogSlugPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogSlugPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) return {};

  return {
    title: `${post.titleEn} | Ca-Ca Canin`,
    description: post.metaDescriptionEn,
    keywords: post.keywordsEn,
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: {
        en: `/blog/${post.slug}`,
        fr: `/fr/blogue/${post.slugFr}`,
      },
    },
    openGraph: {
      title: `${post.titleEn} | Ca-Ca Canin`,
      description: post.metaDescriptionEn,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: "Ca-Ca Canin",
      locale: "en_CA",
      images: [
        {
          url: "/images/cacacaninlogo.jpg",
          width: 1200,
          height: 630,
          alt: post.titleEn,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${post.titleEn} | Ca-Ca Canin`,
      description: post.metaDescriptionEn,
      images: ["/images/cacacaninlogo.jpg"],
    },
  };
}

export default function BlogSlugPage({ params }: BlogSlugPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) notFound();

  return <BlogPostPage locale="en" post={post} />;
}
