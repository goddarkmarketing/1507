import { PublicImage } from "@/components/shared/public-image";
import { cn } from "@/lib/utils";

/** Car PNG with hover pop-out beyond the card edge */
export function VehicleHoverImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] shrink-0 overflow-hidden rounded-t-xl bg-muted/30",
        className
      )}
    >
      <PublicImage
        src={src}
        alt={alt}
        fill
        unoptimized
        className={cn(
          "pointer-events-none object-cover object-center transition-transform duration-500 ease-out will-change-transform",
          "sm:group-hover/vehicle:scale-105"
        )}
        sizes={sizes}
      />
    </div>
  );
}
