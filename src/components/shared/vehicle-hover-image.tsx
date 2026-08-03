import Image from "next/image";
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
        "relative aspect-[16/10] shrink-0 overflow-visible rounded-t-xl bg-muted/30",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className={cn(
          "pointer-events-none object-contain object-bottom p-2 pt-0 transition-transform duration-500 ease-out will-change-transform",
          "sm:group-hover/vehicle:-translate-y-8 sm:group-hover/vehicle:scale-125 sm:group-hover/vehicle:drop-shadow-xl"
        )}
        sizes={sizes}
      />
    </div>
  );
}
