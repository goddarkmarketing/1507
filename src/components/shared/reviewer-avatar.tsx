import { PublicImage } from "@/components/shared/public-image";
import { cn } from "@/lib/utils";

export function ReviewerAvatar({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) {
  return (
    <PublicImage
      src={`/images/reviewers/${id}.png`}
      alt={name}
      width={48}
      height={48}
      className={cn(
        "size-12 shrink-0 rounded-full object-cover ring-1 ring-black/10",
        className
      )}
    />
  );
}
