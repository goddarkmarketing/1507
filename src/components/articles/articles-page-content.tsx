"use client";

import { useMemo, useState } from "react";
import { PublicImage } from "@/components/shared/public-image";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { articles } from "@/lib/data/articles";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  ...Array.from(new Set(articles.map((a) => a.category))),
] as const;

export function ArticlesPageContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryMatch =
        category === "All" || article.category === category;
      const textMatch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="h-9 pl-8"
            aria-label="Search articles"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                category === item
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] bg-muted/40">
                  <PublicImage
                    src={article.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-white/95 text-[10px] text-zinc-950 hover:bg-white sm:top-3 sm:left-3 sm:text-xs">
                    {article.category}
                  </Badge>
                </div>
                <CardHeader className="space-y-1 px-3 pt-3 sm:px-4 sm:pt-4">
                  <CardTitle className="text-sm leading-snug group-hover:text-amber-700 sm:text-base">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {article.readMinutes} min
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 sm:text-sm">
                    Read <ArrowRight className="size-3 sm:size-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          No articles match your filters.
        </p>
      )}

      <div className="mt-12 rounded-2xl bg-zinc-50 px-6 py-10 text-center ring-1 ring-zinc-200/80 sm:px-10">
        <h2 className="text-2xl font-bold">Need a transfer after reading?</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Check live prices and book a private car with instant e-Voucher.
        </p>
        <ButtonLink size="lg" className="mt-5" href="/booking">
          Book Now
        </ButtonLink>
      </div>
    </div>
  );
}
