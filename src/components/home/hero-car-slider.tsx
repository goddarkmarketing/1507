"use client";

import { useCallback, useEffect, useState } from "react";
import { PublicImage } from "@/components/shared/public-image";
import { cn } from "@/lib/utils";

const heroCars = [
  { src: "/vehicles/car-2.png", alt: "Toyota Yaris Ativ" },
  { src: "/vehicles/car-1.png", alt: "Hyundai H-1" },
  { src: "/vehicles/car-3.png", alt: "Honda City RS" },
  { src: "/vehicles/car-4.png", alt: "Toyota Yaris" },
  { src: "/vehicles/car-5.png", alt: "MG5" },
  { src: "/vehicles/car-6.png", alt: "MG ZS" },
  { src: "/vehicles/car-7.png", alt: "Toyota Veloz" },
  { src: "/vehicles/car-8.png", alt: "Honda City Hatchback" },
  { src: "/vehicles/car-9.png", alt: "Mitsubishi Xpander" },
];

export function HeroCarSlider() {
  const [index, setIndex] = useState(0);
  const total = heroCars.length;

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

  return (
    <div className="-mt-1 sm:-mt-3 lg:-mt-2">
      <div className="relative mx-auto flex h-[210px] w-full max-w-2xl items-center justify-center sm:h-[250px] lg:h-[270px]">
        <button
          type="button"
          aria-label={`Show ${heroCars[prev].alt}`}
          onClick={() => goTo(prev)}
          className="absolute left-0 z-10 flex h-full w-[32%] items-center justify-center transition-transform duration-500 ease-out hover:scale-[1.02]"
        >
          <div className="relative h-[48%] w-full opacity-40">
            <PublicImage
              src={heroCars[prev].src}
              alt={heroCars[prev].alt}
              fill
              unoptimized
              className="object-contain transition-all duration-500"
              sizes="220px"
            />
          </div>
        </button>

        <div
          key={heroCars[index].src}
          className="relative z-20 flex h-full w-[64%] items-center justify-center animate-car-focus"
        >
          <div className="relative h-full w-full">
            <PublicImage
              src={heroCars[index].src}
              alt={heroCars[index].alt}
              fill
              unoptimized
              className="scale-110 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
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
          <div className="relative h-[48%] w-full opacity-40">
            <PublicImage
              src={heroCars[next].src}
              alt={heroCars[next].alt}
              fill
              unoptimized
              className="object-contain transition-all duration-500"
              sizes="220px"
            />
          </div>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
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
