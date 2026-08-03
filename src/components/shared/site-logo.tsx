import { cn, assetPath } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  /** Visual height in px — width scales with logo aspect (~2.5:1) */
  height?: number;
  priority?: boolean;
}

export function SiteLogo({
  className,
  height = 40,
  priority = false,
}: SiteLogoProps) {
  const width = Math.round(height * (612 / 242));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetPath("/logo.png")}
      alt="Krabi Links Taxi"
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto" }}
    />
  );
}
