import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Tighter header for form-heavy pages on mobile */
  compact?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  children,
  compact = false,
}: PageHeaderProps) {
  return (
    <section className="border-b bg-gradient-to-br from-primary/10 via-background to-accent/20">
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          compact ? "py-5 sm:py-10" : "py-8 sm:py-12"
        )}
      >
        <h1
          className={cn(
            "text-2xl font-bold tracking-tight sm:text-3xl",
            !compact && "lg:text-4xl"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "max-w-2xl text-muted-foreground",
              compact
                ? "mt-1.5 text-sm leading-snug sm:mt-3 sm:text-lg"
                : "mt-2 text-base sm:mt-3 sm:text-lg"
            )}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-4 sm:mt-6">{children}</div>}
      </div>
    </section>
  );
}
