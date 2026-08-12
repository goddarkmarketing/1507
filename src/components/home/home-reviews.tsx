"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Reviews");
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
          {t(`items.${review.id}.country` as "items.1.country")} ·{" "}
          {t(`items.${review.id}.route` as "items.1.route")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          &ldquo;{t(`items.${review.id}.comment` as "items.1.comment")}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}

export function HomeReviews() {
  const tc = useTranslations("Common");
  const tp = useTranslations("Pages");
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

  const visible = Array.from({ length: VISIBLE }, (_, offset) => {
    return reviews[(index + offset) % total];
  });

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">{tp("reviews")}</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="md:hidden">
            <div className="mx-auto max-w-md px-8">
              <ReviewCard review={reviews[index]} />
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-3 md:gap-4">
            {visible.map((review) => (
              <ReviewCard key={`${review.id}-${index}`} review={review} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute top-1/2 right-0 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {reviews.map((_, i) => (
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
            {tc("allReviews")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
