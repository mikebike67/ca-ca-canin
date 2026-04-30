import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouContent from "@/components/thank-you-content";

export const metadata: Metadata = {
  title: "Thank You | Ca-Ca Canin",
  description: "Thank you for contacting Ca-Ca Canin.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
