"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reviews } from "@/lib/data/content";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

const VISIBLE = 3;

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <CardTitle className="text-base">{review.name}</CardTitle>
        <CardDescription>
          {review.country} · {review.route}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          &ldquo;{review.comment}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}

export function HomeReviews() {
  const total = reviews.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total);
  };

  // Build a window of VISIBLE reviews starting at index (wrap around)
  const visible = Array.from({ length: VISIBLE }, (_, offset) => {
    const review = reviews[(index + offset) % total];
    return review;
  });

  const pageCount = total;

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Mobile: 1 card */}
          <div className="md:hidden">
            <div className="mx-auto max-w-md px-8">
              <ReviewCard review={reviews[index]} />
            </div>
          </div>

          {/* Desktop / tablet: 3 cards */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-4">
            {visible.map((review, i) => (
              <div
                key={`${review.id}-${index}-${i}`}
                className="animate-in fade-in-0 slide-in-from-right-2 duration-500"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="absolute top-1/2 left-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-sm md:-left-2 lg:-left-4"
            onClick={() => go(-1)}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-sm md:-right-2 lg:-right-4"
            onClick={() => go(1)}
            aria-label="Next reviews"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={cn(
                "size-1.5 rounded-full transition-all",
                index === i ? "w-4 bg-zinc-950" : "bg-zinc-300"
              )}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <ButtonLink variant="outline" href="/reviews">
            All Reviews
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
