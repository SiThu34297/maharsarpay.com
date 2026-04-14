"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { HeroSlide } from "@/features/home/schemas/home";

type HomeHeroSliderProps = Readonly<{
  slides: HeroSlide[];
}>;

const AUTO_ROTATE_MS = 6000;

export function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = slides.length;

  const safeActiveIndex = useMemo(() => {
    if (totalSlides <= 0) {
      return 0;
    }

    return activeIndex % totalSlides;
  }, [activeIndex, totalSlides]);

  const activeSlide = slides[safeActiveIndex];

  useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalSlides);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(intervalId);
  }, [totalSlides]);

  if (!activeSlide) {
    return null;
  }

  return (
    <section className="relative h-[52svh] min-h-[340px] w-full overflow-hidden sm:h-[58svh] md:h-[64svh] md:min-h-[460px] lg:h-[72svh] xl:h-[78svh]">
      <Image
        src={activeSlide.imageSrc}
        alt={activeSlide.imageAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={safeActiveIndex === 0}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10 lg:p-14">
        <h1 className="max-w-4xl text-2xl leading-tight lg:text-3xl">{activeSlide.title}</h1>
      </div>
    </section>
  );
}
