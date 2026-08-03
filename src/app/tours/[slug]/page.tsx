import { PublicImage } from "@/components/shared/public-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRelatedTours, getTour, tours } from "@/lib/data/tours";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  const related = getRelatedTours(tour.slug, 3);
  const bookingHref = tour.pierId
    ? `/booking?to=${tour.pierId}`
    : "/pier-transfer";

  return (
    <article>
      <section className="border-b bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
          <Link
            href="/tours"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All tours
          </Link>
          <Badge variant="outline">{tour.category}</Badge>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {tour.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {tour.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {tour.fromArea} → {tour.toArea}
            </span>
            <span className="font-medium text-foreground">
              From ฿{tour.priceFrom.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 text-left sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted/40">
            <PublicImage
              src={tour.coverImage}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {tour.content.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 text-lg font-bold">Highlights</h2>
              <ul className="space-y-2 text-sm">
                {tour.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 text-lg font-bold">Typically includes</h2>
              <ul className="space-y-2 text-sm">
                {tour.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-gold-gradient px-6 py-8 text-primary-foreground shadow-lg shadow-amber-500/20">
            <h2 className="text-xl font-bold">Book pier or hotel transfer</h2>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Tour tickets are sold by local operators. We get you to the
              meeting pier on time with an e-Voucher.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink variant="secondary" href={bookingHref}>
                Book Transfer <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                variant="outline"
                className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"
                href="/contact"
              >
                Inquire
              </ButtonLink>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-4 text-lg font-bold">Related tours</h2>
            <div className="flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tours/${item.slug}`}
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
                        <CardDescription className="text-xs">
                          From ฿{item.priceFrom.toLocaleString("en-US")}
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
