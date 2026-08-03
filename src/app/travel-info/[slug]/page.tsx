import { PublicImage } from "@/components/shared/public-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBoatSchedule } from "@/lib/data/boat-schedules";
import { getTour } from "@/lib/data/tours";
import {
  getRelatedGuides,
  getTravelGuide,
  travelGuides,
} from "@/lib/data/travel-guides";
import type { BoatSchedule, Tour } from "@/lib/types";

export function generateStaticParams() {
  return travelGuides.map((guide) => ({ slug: guide.slug }));
}

export default async function TravelInfoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getTravelGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide.slug, 3);
  const relatedTours = (guide.relatedTourSlugs ?? [])
    .map((s) => getTour(s))
    .filter((t): t is Tour => Boolean(t));
  const relatedBoats = (guide.relatedBoatRouteIds ?? [])
    .map((id) => getBoatSchedule(id))
    .filter((b): b is BoatSchedule => Boolean(b));

  return (
    <article>
      <section className="border-b bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
          <Link
            href="/travel-info"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All travel info
          </Link>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{guide.category}</Badge>
            <Badge variant="secondary">{guide.region}</Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {guide.excerpt}
          </p>
          <p className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {guide.readMinutes} min read
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 text-left sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted/40">
            <PublicImage
              src={guide.coverImage}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>

          <div className="mb-8 rounded-xl border bg-muted/30 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Lightbulb className="size-5 text-amber-700" />
              Quick tips
            </h2>
            <ul className="space-y-2 text-sm">
              {guide.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-amber-700">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {guide.content.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {(relatedTours.length > 0 || relatedBoats.length > 0) && (
            <div className="mt-10 space-y-6">
              {relatedTours.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-bold">Related tours</h2>
                  <ul className="space-y-2 text-sm">
                    {relatedTours.map((tour) => (
                      <li key={tour.slug}>
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="font-medium text-amber-800 hover:underline"
                        >
                          {tour.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relatedBoats.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-bold">Related boat routes</h2>
                  <ul className="space-y-2 text-sm">
                    {relatedBoats.map((boat) => (
                      <li key={boat.id}>
                        <Link
                          href="/boat-schedules"
                          className="font-medium text-amber-800 hover:underline"
                        >
                          {boat.routeLabel}
                        </Link>
                        <span className="text-muted-foreground">
                          {" "}
                          · {boat.type} · from ฿
                          {boat.priceFrom.toLocaleString("en-US")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-gold-gradient px-6 py-8 text-primary-foreground shadow-lg shadow-amber-500/20">
            <h2 className="text-xl font-bold">Plan the transfer next</h2>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Check boat times, then book a private transfer to the pier or
              hotel.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink variant="secondary" href="/boat-schedules">
                Boat Schedules
              </ButtonLink>
              <ButtonLink
                variant="outline"
                className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"
                href="/booking"
              >
                Book Transfer <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-4 text-lg font-bold">More guides</h2>
            <div className="flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/travel-info/${item.slug}`}
                  className="group block"
                >
                  <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                    <div className="flex min-h-[108px]">
                      <div className="relative w-28 shrink-0 bg-muted/40 sm:w-32">
                        <PublicImage
                          src={item.coverImage}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="128px"
                        />
                      </div>
                      <CardHeader className="min-w-0 flex-1 gap-1.5 p-3 sm:p-4">
                        <Badge variant="outline" className="w-fit text-[10px]">
                          {item.category}
                        </Badge>
                        <CardTitle className="line-clamp-2 text-sm leading-snug group-hover:text-amber-700">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {item.excerpt}
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
