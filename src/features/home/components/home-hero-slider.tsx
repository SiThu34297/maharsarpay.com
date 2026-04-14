"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import type { HeroSlide } from "@/features/home/schemas/home";

type HomeHeroSliderProps = Readonly<{
  slides: HeroSlide[];
  badge: string;
  primaryCta: string;
  secondaryCta: string;
  previousLabel: string;
  nextLabel: string;
}>;

const AUTO_ROTATE_MS = 6000;

export function HomeHeroSlider({
  slides,
  badge,
  primaryCta,
  secondaryCta,
  previousLabel,
  nextLabel,
}: HomeHeroSliderProps) {
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

  function handlePrevious() {
    setActiveIndex((current) => {
      if (totalSlides <= 0) return 0;
      return (current - 1 + totalSlides) % totalSlides;
    });
  }

  function handleNext() {
    setActiveIndex((current) => {
      if (totalSlides <= 0) return 0;
      return (current + 1) % totalSlides;
    });
  }

  if (!activeSlide) {
    return null;
  }

  return (
    <div className="grid gap-8 rounded-[24px] bg-white p-6 shadow-[var(--shadow-soft)] lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-10 lg:p-10">
      <div>
        <p className="mb-4 inline-flex rounded-full bg-[var(--color-brand-subtle)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-brand)]">
          {badge}
        </p>
        <h1 className="max-w-xl text-4xl leading-tight text-[var(--color-text-main)] md:text-5xl">
          {activeSlide.title}
        </h1>
        <p className="mt-4 max-w-xl text-base text-[var(--color-text-muted)] md:text-lg">
          {activeSlide.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={activeSlide.primaryHref} className="cta-primary">
            {primaryCta}
          </Link>
          <Link href={activeSlide.secondaryHref} className="cta-secondary">
            {secondaryCta}
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === safeActiveIndex ? "true" : undefined}
              className={`h-2 rounded-full transition ${
                index === safeActiveIndex
                  ? "w-8 bg-[var(--color-brand)]"
                  : "w-2 bg-[var(--color-border)] hover:bg-[var(--color-brand)]/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-brand-subtle)]/50 p-3">
        <Image
          src={activeSlide.imageSrc}
          alt={activeSlide.imageAlt}
          width={640}
          height={460}
          className="h-auto w-full rounded-2xl object-cover"
          priority={safeActiveIndex === 0}
        />

        {totalSlides > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-between px-4">
            <button
              type="button"
              onClick={handlePrevious}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              aria-label={previousLabel}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              aria-label={nextLabel}
            >
              <ChevronRightIcon />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
