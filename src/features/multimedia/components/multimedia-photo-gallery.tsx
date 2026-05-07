"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type PhotoItem = {
  id: string;
  src: string;
  alt: string;
};

type MultimediaPhotoGalleryProps = Readonly<{
  items: PhotoItem[];
}>;

function getPhotoMasonryVariant(index: number, totalItems: number) {
  if (totalItems === 1) {
    return "photo-frame-featured";
  }

  const variants = ["photo-frame-standard", "photo-frame-tall", "photo-frame-wide"];
  return variants[index % variants.length];
}

export function MultimediaPhotoGallery({ items }: MultimediaPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = items.length;

  const activeItem = useMemo(() => {
    if (activeIndex === null || !items[activeIndex]) {
      return null;
    }

    return items[activeIndex];
  }, [activeIndex, items]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) {
            return 0;
          }

          return (current + 1) % total;
        });
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) {
            return 0;
          }

          return (current - 1 + total) % total;
        });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, total]);

  return (
    <>
      {items.map((item, index) => (
        <article
          key={item.id}
          className="multimedia-detail-masonry-item multimedia-detail-masonry-item-photo"
        >
          <button
            type="button"
            className="multimedia-detail-photo-trigger"
            onClick={() => setActiveIndex(index)}
            aria-label={`Preview image ${index + 1}`}
          >
            <div
              className={`multimedia-detail-masonry-photo-frame ${getPhotoMasonryVariant(index, total)}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="multimedia-detail-masonry-photo"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
          </button>
        </article>
      ))}

      {activeItem ? (
        <div
          className="multimedia-photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="multimedia-photo-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="multimedia-photo-lightbox-close"
              onClick={() => setActiveIndex(null)}
              aria-label="Close preview"
            >
              ×
            </button>

            <button
              type="button"
              className="multimedia-photo-lightbox-nav multimedia-photo-lightbox-nav-prev"
              onClick={() =>
                setActiveIndex((current) => {
                  if (current === null) {
                    return 0;
                  }

                  return (current - 1 + total) % total;
                })
              }
              aria-label="Previous image"
            >
              ‹
            </button>

            <div className="multimedia-photo-lightbox-stage">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                className="multimedia-photo-lightbox-image"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              className="multimedia-photo-lightbox-nav multimedia-photo-lightbox-nav-next"
              onClick={() =>
                setActiveIndex((current) => {
                  if (current === null) {
                    return 0;
                  }

                  return (current + 1) % total;
                })
              }
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
