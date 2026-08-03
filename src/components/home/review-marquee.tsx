"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, XIcon } from "lucide-react";
import { cn, assetPath } from "@/lib/utils";

/** Synced from /รีวิว — update count when folder changes */
const REVIEW_COUNT = 76;
const reviewImages = Array.from(
  { length: REVIEW_COUNT },
  (_, i) => assetPath(`/reviews/review-${i + 1}.jpg`)
);

function StarTrack({
  direction,
  tone = "dark",
}: {
  direction: "left" | "right";
  tone?: "dark" | "light";
}) {
  const stars = Array.from({ length: 28 });
  const track = [...stars, ...stars];

  return (
    <div
      className={cn(
        "flex w-max items-center gap-8 will-change-transform sm:gap-10",
        direction === "left"
          ? "animate-star-ribbon-left"
          : "animate-star-ribbon-right"
      )}
    >
      {track.map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-8 shrink-0 sm:size-10",
            tone === "dark"
              ? "fill-zinc-950 text-zinc-950"
              : "fill-white text-white"
          )}
        />
      ))}
    </div>
  );
}

function StarRibbon({ className }: { className?: string }) {
  return (
    <div
      className={cn("star-ribbon-section pointer-events-none relative py-2", className)}
      aria-hidden
    >
      <div className="star-ribbon-band star-ribbon-band--front">
        <StarTrack direction="right" tone="dark" />
      </div>
      <div className="star-ribbon-band star-ribbon-band--back">
        <StarTrack direction="left" tone="light" />
      </div>
    </div>
  );
}

function MarqueeRow({
  images,
  direction,
  duration = 60,
  onOpen,
}: {
  images: string[];
  direction: "left" | "right";
  duration?: number;
  onOpen: (src: string) => void;
}) {
  const track = [...images, ...images];

  return (
    <div
      className={cn(
        "flex w-max gap-3 will-change-transform sm:gap-4",
        direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
      )}
      style={{ animationDuration: `${duration}s` }}
    >
      {track.map((src, i) => (
        <button
          key={`${src}-${i}`}
          type="button"
          className="relative h-40 w-56 shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-border/40 bg-zinc-100 shadow-sm transition-transform duration-200 hover:z-20 hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-44 sm:w-64 sm:rounded-xl"
          onClick={() => onOpen(src)}
          aria-label={`View review ${(i % images.length) + 1}`}
        >
          <img
            src={src}
            alt={`Customer review ${(i % images.length) + 1}`}
            loading="eager"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </button>
      ))}
    </div>
  );
}

/** Mobile: one review at a time */
function MobileReviewSlider({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (src: string) => void;
}) {
  const slides = images.slice(0, 12);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const src = slides[index];

  return (
    <div
      className="px-4"
      onTouchStart={(e) => {
        setPaused(true);
        setStartX(e.touches[0]?.clientX ?? null);
      }}
      onTouchEnd={(e) => {
        setPaused(false);
        if (startX == null) return;
        const endX = e.changedTouches[0]?.clientX ?? startX;
        const dx = endX - startX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        setStartX(null);
      }}
    >
      <div className="relative mx-auto max-w-sm">
        <button
          type="button"
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border bg-zinc-100 shadow-sm"
          onClick={() => onOpen(src)}
          aria-label={`View review ${index + 1}`}
        >
          <img
            src={src}
            alt={`Customer review ${index + 1}`}
            className="h-full w-full object-cover object-top"
            decoding="async"
          />
        </button>

        <button
          type="button"
          className="absolute top-1/2 left-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          onClick={() => go(-1)}
          aria-label="Previous review"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          onClick={() => go(1)}
          aria-label="Next review"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-xs tabular-nums text-muted-foreground">
          {index + 1} / {slides.length}
        </span>
        <span className="text-xs text-muted-foreground">· tap to enlarge</span>
      </div>
    </div>
  );
}

export function ReviewMarquee() {
  const mid = Math.ceil(reviewImages.length / 2);
  const topRow = reviewImages.slice(0, mid);
  const bottomRow = reviewImages.slice(mid);

  const [paused, setPaused] = useState(false);
  const [lockedPreview, setLockedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!lockedPreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLockedPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lockedPreview]);

  return (
    <section className="relative overflow-x-clip border-b bg-background py-10 sm:py-14">
      <div className="mb-4 px-4 text-center sm:mb-5 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Customer Reviews</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          <span className="md:hidden">Swipe or tap arrows · tap photo to enlarge</span>
          <span className="hidden md:inline">Hover to pause · click to enlarge</span>
        </p>
      </div>

      <StarRibbon className="mb-5 sm:mb-6" />

      {/* Mobile slider — one review at a time */}
      <div className="md:hidden">
        <MobileReviewSlider images={reviewImages} onOpen={setLockedPreview} />
      </div>

      {/* Desktop marquee */}
      <div
        className={cn(
          "relative hidden space-y-3 md:block",
          paused && "marquee-paused"
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative overflow-hidden">
          <MarqueeRow
            images={topRow}
            direction="left"
            duration={160}
            onOpen={setLockedPreview}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background from-20% to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background from-20% to-transparent sm:w-20" />
        </div>
        <div className="relative overflow-hidden">
          <MarqueeRow
            images={bottomRow}
            direction="right"
            duration={180}
            onOpen={setLockedPreview}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background from-20% to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background from-20% to-transparent sm:w-20" />
        </div>
      </div>

      {lockedPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in-0 duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Review preview"
          onClick={() => setLockedPreview(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
              onClick={() => setLockedPreview(null)}
              aria-label="Close preview"
            >
              <XIcon className="size-4" />
            </button>
            <img
              src={lockedPreview}
              alt="Customer review enlarged"
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
