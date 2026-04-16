"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type PreviewImage = {
  src: string;
  alt: string;
};

type BookDetailImagePreviewProps = Readonly<{
  images: PreviewImage[];
  title: string;
}>;

const ZOOM_SCALE = 2.4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BookDetailImagePreview({ images, title }: BookDetailImagePreviewProps) {
  const safeImages = useMemo(() => (images.length > 0 ? images : []), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomX, setZoomX] = useState(50);
  const [zoomY, setZoomY] = useState(50);

  if (safeImages.length === 0) {
    return null;
  }

  const selectedImage = safeImages[selectedIndex] ?? safeImages[0];

  function handleImageHover(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    setZoomX(clamp(relativeX * 100, 0, 100));
    setZoomY(clamp(relativeY * 100, 0, 100));
  }

  return (
    <div className="book-detail-image-preview">
      <div className="book-detail-image-main-row">
        <div
          className="book-detail-image-main"
          onMouseEnter={() => setIsZoomActive(true)}
          onMouseLeave={() => setIsZoomActive(false)}
          onMouseMove={handleImageHover}
          aria-label={`${title} image preview`}
        >
          <div className="book-detail-cover-glow" aria-hidden />
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={680}
            height={900}
            className="book-detail-cover book-detail-cover-zoomable"
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
            style={{
              transform: isZoomActive ? `scale(${ZOOM_SCALE})` : "scale(1)",
              transformOrigin: `${zoomX}% ${zoomY}%`,
            }}
          />
        </div>
      </div>

      <div className="book-detail-image-thumbs" role="tablist" aria-label={`${title} thumbnails`}>
        {safeImages.map((image, index) => {
          const isActive = index === selectedIndex;
          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`book-detail-thumb ${isActive ? "book-detail-thumb-active" : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={80}
                height={100}
                className="book-detail-thumb-image"
                sizes="80px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
