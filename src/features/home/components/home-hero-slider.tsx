"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import type { HeroSlide } from "@/features/home/schemas/home";

type HomeHeroSliderProps = Readonly<{
  slides: HeroSlide[];
  previousLabel: string;
  nextLabel: string;
}>;

const AUTO_ROTATE_MS = 6000;

export function HomeHeroSlider({ slides, previousLabel, nextLabel }: HomeHeroSliderProps) {
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

  function handlePrevious() {
    setActiveIndex((current) => {
      if (totalSlides <= 0) {
        return 0;
      }

      return (current - 1 + totalSlides) % totalSlides;
    });
  }

  function handleNext() {
    setActiveIndex((current) => {
      if (totalSlides <= 0) {
        return 0;
      }

      return (current + 1) % totalSlides;
    });
  }

  return (
    <section className="relative h-[52svh] min-h-[340px] w-full overflow-hidden sm:h-[58svh] md:h-[64svh] md:min-h-[460px] lg:h-[72svh] xl:h-[78svh]">
      {slides.map((slide, index) => {
        const isActive = index === safeActiveIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-105"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={index === 0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          </div>
        );
      })}
      {totalSlides > 1 ? (
        <div className="absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-between px-4 sm:px-6 md:flex md:px-8">
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-text-main)] shadow-md transition hover:bg-white md:h-12 md:w-12"
            aria-label={previousLabel}
          >
            <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-text-main)] shadow-md transition hover:bg-white md:h-12 md:w-12"
            aria-label={nextLabel}
          >
            <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      ) : null}
      {totalSlides > 1 ? (
        <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center px-6 md:bottom-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
            {slides.map((slide, index) => {
              const isActive = index === safeActiveIndex;

              return (
                <button
                  key={`nav-${slide.id}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full touch-manipulation transition-all duration-300 ${
                    isActive ? "w-8 bg-[var(--color-brand)]" : "w-2.5 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 p-6 text-white md:bottom-20 md:p-10 lg:p-14">
        <h1
          key={activeSlide.id}
          className="max-w-4xl text-2xl leading-tight transition-all duration-500 lg:text-3xl"
        >
          {activeSlide.title}
        </h1>
      </div>
    </section>
  );
}
