'use client'

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
  style: ["normal"],
});

const pairs = [
  {
    before: "/images/cleanup-before-1.jpg",
    after: "/images/Cleanup-after-1.jpg",
    altBefore: "Stepping stone pathway covered in dog waste before cleanup",
    altAfter: "Same stepping stone pathway completely clean after Ca-Ca Canin cleanup",
  },
  {
    before: "/images/cleanup-before-2-1.jpg",
    after: "/images/cleanup-after-2-2.jpg",
    altBefore: "Yard area with accumulated dog waste before cleanup",
    altAfter: "Yard area spotless after Ca-Ca Canin dog waste removal",
  },
  {
    before: "/images/cleanup-before-2-2.jpg",
    after: "/images/cleanup-after-2-1.jpg",
    altBefore: "Second view of yard with dog waste before cleanup",
    altAfter: "Second view of same yard fully cleaned by Ca-Ca Canin",
  },
  {
    before: "/images/cleanup-before-3.jpg",
    after: "/images/cleanup-after-3.jpg",
    altBefore: "Residential yard with dog waste buildup before cleanup",
    altAfter: "Residential yard fully cleared after Ca-Ca Canin visit",
  },
  {
    before: "/images/cleanup-before-4.jpg",
    after: "/images/cleanup-after-4.jpg",
    altBefore: "Backyard with dog waste before Ca-Ca Canin cleanup service",
    altAfter: "Backyard completely clean after Ca-Ca Canin dog waste removal",
  },
  {
    before: "/images/cleanup-before-5.jpg",
    after: "/images/cleanup-after-5.jpg",
    altBefore: "Yard area showing dog waste accumulation before cleanup",
    altAfter: "Same yard area fully cleaned and waste-free after service",
  },
];

type BeforeAfterGalleryProps = {
  locale?: "en" | "fr";
};

export default function BeforeAfterGallery({ locale = "en" }: BeforeAfterGalleryProps) {
  const isFrench = locale === "fr";

  const allImages = pairs.flatMap((pair) => [
    { src: pair.before, alt: pair.altBefore, label: isFrench ? "Avant" : "Before" },
    { src: pair.after, alt: pair.altAfter, label: isFrench ? "Après" : "After" },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + allImages.length) % allImages.length)),
    [allImages.length]
  );
  const next = useCallback(() =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % allImages.length)),
    [allImages.length]
  );
  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const current = activeIndex !== null ? allImages[activeIndex] : null;

  return (
    <>
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-animation">
            <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>
              {isFrench ? "Avant et après" : "Before & after"}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              {isFrench
                ? "Résultats réels de vrais nettoyages chez des clients de Laval et de la Rive-Nord."
                : "Real results from real cleanups at homes across Laval and the North Shore."}
            </p>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {pairs.map((pair, index) => (
              <div
                key={index}
                className="scroll-animation overflow-hidden rounded-xl sm:rounded-2xl border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)]"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <div className="grid grid-cols-2">
                  <button
                    className="relative aspect-[3/4] overflow-hidden cursor-zoom-in"
                    onClick={() => setActiveIndex(index * 2)}
                    aria-label={pair.altBefore}
                  >
                    <Image
                      src={pair.before}
                      alt={pair.altBefore}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-2 py-1.5">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
                        {isFrench ? "Avant" : "Before"}
                      </span>
                    </div>
                  </button>
                  <button
                    className="relative aspect-[3/4] overflow-hidden cursor-zoom-in"
                    onClick={() => setActiveIndex(index * 2 + 1)}
                    aria-label={pair.altAfter}
                  >
                    <Image
                      src={pair.after}
                      alt={pair.altAfter}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-[#307944]/80 to-transparent px-2 py-1.5">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                        {isFrench ? "Après" : "After"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top bar: label + close */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
            <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
              {current.label}
            </span>
            <button
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={close}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image area — side arrows visible on sm+ */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-16">
            {/* Desktop side arrows */}
            <button
              className="absolute left-2 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:flex"
              onClick={prev}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <Image
              src={current.src}
              alt={current.alt}
              width={800}
              height={1067}
              style={{ maxHeight: "calc(100vh - 120px)" }}
              className="w-auto max-w-full rounded-xl object-contain"
              priority
            />

            <button
              className="absolute right-2 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:flex"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom bar: mobile arrows + counter */}
          <div className="flex shrink-0 items-center justify-center gap-5 py-4">
            <button
              className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 sm:hidden"
              onClick={prev}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="text-sm text-white/50">
              {(activeIndex ?? 0) + 1} / {allImages.length}
            </span>
            <button
              className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 sm:hidden"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
