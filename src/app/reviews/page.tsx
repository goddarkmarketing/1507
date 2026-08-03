import { Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reviews } from "@/lib/data/content";

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        title="Customer Reviews"
        subtitle="Real feedback from travelers who used Krabi Links Taxi."
      />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-12 sm:gap-6 lg:px-8">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <CardTitle className="text-base">{review.name}</CardTitle>
              <CardDescription>
                {review.country} · {review.route} · {review.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">&ldquo;{review.comment}&rdquo;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
