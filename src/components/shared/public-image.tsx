import { cn, assetPath } from "@/lib/utils";

type PublicImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  unoptimized?: boolean;
  style?: React.CSSProperties;
};

/**
 * Public-folder images with GitHub Pages basePath support.
 * Prefer this over next/image for /public assets on static export.
 */
export function PublicImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  style,
}: PublicImageProps) {
  const resolved = assetPath(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      style={style}
    />
  );
}
