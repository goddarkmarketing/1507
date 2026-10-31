"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PublicImage } from "@/components/shared/public-image";
import { cn } from "@/lib/utils";

const heroCars = [
  { src: "/vehicles/fleet/eco-mg-ep.webp", alt: "MG EP Economy EV" },
  { src: "/vehicles/fleet/prem-camry.webp", alt: "Toyota Camry Luxury" },
  { src: "/vehicles/fleet/suv-fortuner.webp", alt: "Toyota Fortuner SUV" },
  { src: "/vehicles/fleet/van-commuter.webp", alt: "Toyota Commuter Van" },
  { src: "/vehicles/fleet/exe-vip-van.webp", alt: "VIP Van Toyota New Commuter" },
  { src: "/vehicles/fleet/vip-alphard.webp", alt: "Toyota Alphard VIP" },
  { src: "/vehicles/fleet/bus-coaster.webp", alt: "Toyota Coaster Mini Bus" },
];

export function HeroCarSlider() {
  const [index, setIndex] = useState(0);
  const total = heroCars.length;
  const touchStartX = useRef<number | null>(null);

  const prev = (index - 1 + total) % total;
  const next = (index + 1) % total;

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(((nextIndex % total) + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <div className="-mt-1 sm:-mt-3 lg:-mt-2">
      {/* Mobile / tablet: one slide at a time */}
      <div
        className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-[1.25rem] shadow-[0_10px_24px_rgba(0,0,0,0.14)] ring-1 ring-black/8 sm:rounded-[1.5rem] lg:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PublicImage
          key={heroCars[index].src}
          src={heroCars[index].src}
          alt={heroCars[index].alt}
          fill
          unoptimized
          className="animate-car-focus object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 640px"
          priority
        />
        <button
          type="button"
          aria-label={`Show ${heroCars[prev].alt}`}
          onClick={() => goTo(index - 1)}
          className="absolute inset-y-0 left-0 z-10 w-1/3"
        />
        <button
          type="button"
          aria-label={`Show ${heroCars[next].alt}`}
          onClick={() => goTo(index + 1)}
          className="absolute inset-y-0 right-0 z-10 w-1/3"
        />
      </div>

      {/* Desktop: center focus with side peeks */}
      <div className="relative mx-auto hidden h-[270px] w-full max-w-2xl items-center justify-center lg:flex">
        <button
          type="button"
          aria-label={`Show ${heroCars[prev].alt}`}
          onClick={() => goTo(prev)}
          className="absolute left-0 z-10 flex h-full w-[32%] items-center justify-center transition-transform duration-500 ease-out hover:scale-[1.02]"
        >
          <div className="relative h-[52%] w-[92%] overflow-hidden rounded-2xl opacity-45 shadow-sm ring-1 ring-black/5">
            <PublicImage
              src={heroCars[prev].src}
              alt={heroCars[prev].alt}
              fill
              unoptimized
              className="object-cover object-center transition-all duration-500"
              sizes="220px"
            />
          </div>
        </button>

        <div
          key={heroCars[index].src}
          className="relative z-20 flex h-full w-[68%] items-center justify-center animate-car-focus"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] shadow-[0_12px_28px_rgba(0,0,0,0.16)] ring-1 ring-black/8">
            <PublicImage
              src={heroCars[index].src}
              alt={heroCars[index].alt}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="420px"
              priority
            />
          </div>
        </div>

        <button
          type="button"
          aria-label={`Show ${heroCars[next].alt}`}
          onClick={() => goTo(next)}
          className="absolute right-0 z-10 flex h-full w-[32%] items-center justify-center transition-transform duration-500 ease-out hover:scale-[1.02]"
        >
          <div className="relative h-[52%] w-[92%] overflow-hidden rounded-2xl opacity-45 shadow-sm ring-1 ring-black/5">
            <PublicImage
              src={heroCars[next].src}
              alt={heroCars[next].alt}
              fill
              unoptimized
              className="object-cover object-center transition-all duration-500"
              sizes="220px"
            />
          </div>
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-2">
        {heroCars.map((car, i) => (
          <button
            key={car.src}
            type="button"
            aria-label={`Show ${car.alt}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index
                ? "w-6 bg-gold-gradient"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
