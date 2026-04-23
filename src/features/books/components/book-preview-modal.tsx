"use client";

import dynamic from "next/dynamic";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const PdfDocument = dynamic(() => import("react-pdf").then((module) => module.Document), {
  ssr: false,
}) as ComponentType<Record<string, unknown>>;

const PdfPage = dynamic(() => import("react-pdf").then((module) => module.Page), {
  ssr: false,
}) as ComponentType<Record<string, unknown>>;

const FlipBook = dynamic(() => import("react-pageflip").then((module) => module.default), {
  ssr: false,
}) as unknown as React.ComponentType<Record<string, unknown>>;

const FLIPBOOK_WIDTH = 480;
const FLIPBOOK_HEIGHT = 640;
const MOBILE_FLIPBOOK_WIDTH = 340;
const MOBILE_FLIPBOOK_HEIGHT = 500;

type FlipBookRef = {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
};

type FlipPageProps = {
  pageNumber: number;
  pageWidth: number;
};

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(function FlipPage(
  { pageNumber, pageWidth },
  ref,
) {
  return (
    <div ref={ref} className="book-preview-flip-page">
      <div className="book-preview-flip-page-inner">
        <PdfPage
          pageNumber={pageNumber}
          width={pageWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          loading={<div className="book-preview-page-loading" aria-hidden />}
        />
      </div>
    </div>
  );
});

type BookPreviewModalProps = Readonly<{
  title: string;
  pdfSrc: string;
  previewTitle: string;
  previewCtaLabel: string;
  openPreviewLabel: string;
  downloadPreviewLabel: string;
  closePreviewLabel: string;
  triggerVariant?: "section" | "inline" | "inlineLink";
}>;

export function BookPreviewModal({
  title,
  pdfSrc,
  previewTitle,
  previewCtaLabel,
  openPreviewLabel,
  downloadPreviewLabel,
  closePreviewLabel,
  triggerVariant = "section",
}: BookPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [isReaderLoading, setIsReaderLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasReaderError, setHasReaderError] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const proxiedPdfSrc = useMemo(() => {
    return `/api/books/preview?src=${encodeURIComponent(pdfSrc)}`;
  }, [pdfSrc]);
  const pdfDocumentOptions = useMemo(
    () => ({
      cMapUrl: "/pdfjs/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      // Avoid noisy runtime warnings for unavailable local fonts in browser environments.
      useSystemFonts: false,
    }),
    [],
  );

  const displayPages = useMemo(() => {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }, [pageCount]);

  let readerContent: ReactNode = null;

  const isMobileReader = isMobileViewport;
  const flipbookWidth = isMobileReader ? MOBILE_FLIPBOOK_WIDTH : FLIPBOOK_WIDTH;
  const flipbookHeight = isMobileReader ? MOBILE_FLIPBOOK_HEIGHT : FLIPBOOK_HEIGHT;
  const flipbookContainerWidth = isMobileReader ? MOBILE_FLIPBOOK_WIDTH : FLIPBOOK_WIDTH * 2;
  const pageWidth = Math.max(220, flipbookWidth - 44);

  if (hasReaderError) {
    readerContent = (
      <div className="book-preview-reader-error">
        <output>Could not load preview pages in reader.</output>
      </div>
    );
  } else if (pageCount > 0) {
    readerContent = (
      <FlipBook
        ref={flipBookRef}
        width={flipbookWidth}
        height={flipbookHeight}
        minWidth={isMobileReader ? MOBILE_FLIPBOOK_WIDTH : FLIPBOOK_WIDTH}
        maxWidth={flipbookWidth}
        minHeight={isMobileReader ? MOBILE_FLIPBOOK_HEIGHT : FLIPBOOK_HEIGHT}
        maxHeight={isMobileReader ? MOBILE_FLIPBOOK_HEIGHT : FLIPBOOK_HEIGHT}
        size="stretch"
        maxShadowOpacity={0.35}
        showCover={false}
        drawShadow
        autoSize={true}
        usePortrait={isMobileReader}
        mobileScrollSupport
        flippingTime={650}
        className="book-preview-flipbook"
        style={{
          width: `${flipbookContainerWidth}px`,
          height: `${flipbookHeight}px`,
          maxWidth: "100%",
          marginInline: "auto",
        }}
        onFlip={(event: { data?: number }) => {
          setCurrentPage((event.data ?? 0) + 1);
        }}
      >
        {displayPages.map((pageNumber) => (
          <FlipPage key={pageNumber} pageNumber={pageNumber} pageWidth={pageWidth} />
        ))}
      </FlipBook>
    );
  }

  function openReader() {
    setPageCount(0);
    setCurrentPage(1);
    setHasReaderError(false);
    setIsReaderLoading(true);
    setIsOpen(true);
  }

  function closeReader() {
    setIsOpen(false);
  }

  function handlePrevPage() {
    flipBookRef.current?.pageFlip().flipPrev();
  }

  function handleNextPage() {
    flipBookRef.current?.pageFlip().flipNext();
  }

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  useEffect(() => {
    let isMounted = true;

    void import("react-pdf").then(({ pdfjs }) => {
      if (!isMounted) {
        return;
      }

      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeReader();
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(max-width: 767px)");

    function applyViewportMode() {
      setIsMobileViewport(mediaQuery.matches);
    }

    applyViewportMode();
    mediaQuery.addEventListener("change", applyViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", applyViewportMode);
    };
  }, []);

  const triggerButton =
    triggerVariant === "inlineLink" ? (
      <button
        type="button"
        className="book-detail-spec-link book-detail-spec-link-button"
        onClick={openReader}
      >
        {previewCtaLabel}
      </button>
    ) : (
      <button
        type="button"
        className={`book-detail-preview-open-button ${
          triggerVariant === "inline" ? "book-detail-preview-open-button-inline" : ""
        }`}
        onClick={openReader}
      >
        <svg
          className="book-detail-preview-open-button-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M1.5 12C3.4 8.3 7.2 6 12 6C16.8 6 20.6 8.3 22.5 12C20.6 15.7 16.8 18 12 18C7.2 18 3.4 15.7 1.5 12Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>{previewCtaLabel}</span>
      </button>
    );

  return (
    <>
      {triggerVariant === "section" ? (
        <section className="book-detail-preview" aria-label={previewTitle}>
          <div className="book-detail-preview-header">
            <h2>{previewTitle}</h2>
            {triggerButton}
          </div>
        </section>
      ) : (
        triggerButton
      )}

      {isOpen && portalContainer
        ? createPortal(
            <dialog
              open
              className="book-preview-modal-overlay"
              aria-label={previewTitle}
              onClose={closeReader}
            >
              <button
                type="button"
                className="book-preview-modal-backdrop"
                aria-label={closePreviewLabel}
                onClick={closeReader}
              />

              <div className="book-preview-modal">
                <div className="book-preview-modal-header">
                  <h3>{title}</h3>
                  <div className="book-preview-modal-header-actions">
                    <a
                      href={proxiedPdfSrc}
                      download
                      className="book-preview-modal-download-mobile"
                      aria-label={downloadPreviewLabel}
                      title={openPreviewLabel}
                    >
                      {downloadPreviewLabel}
                    </a>

                    <button
                      type="button"
                      className="book-preview-modal-close"
                      aria-label={closePreviewLabel}
                      onClick={closeReader}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="book-preview-modal-reader" aria-busy={isReaderLoading}>
                  <div className="book-preview-reader-toolbar">
                    <div className="book-preview-reader-switch">
                      <button
                        type="button"
                        className="book-preview-reader-nav"
                        aria-label="Previous page"
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1 || hasReaderError || pageCount === 0}
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        className="book-preview-reader-nav"
                        aria-label="Next page"
                        onClick={handleNextPage}
                        disabled={currentPage >= pageCount || hasReaderError || pageCount === 0}
                      >
                        →
                      </button>
                    </div>

                    <a
                      href={proxiedPdfSrc}
                      download
                      className="book-preview-reader-download"
                      aria-label={downloadPreviewLabel}
                      title={openPreviewLabel}
                    >
                      {downloadPreviewLabel}
                    </a>
                  </div>

                  {isReaderLoading ? (
                    <div className="book-preview-modal-reader-overlay" aria-hidden />
                  ) : null}

                  <PdfDocument
                    file={proxiedPdfSrc}
                    options={pdfDocumentOptions}
                    onLoadSuccess={({ numPages }: { numPages: number }) => {
                      setPageCount(numPages);
                      setCurrentPage(1);
                      setIsReaderLoading(false);
                    }}
                    onLoadError={() => {
                      setHasReaderError(true);
                      setIsReaderLoading(false);
                    }}
                    loading={null}
                    error={null}
                  >
                    <div className="book-preview-reader-stage">{readerContent}</div>
                  </PdfDocument>
                </div>
              </div>
            </dialog>,
            portalContainer,
          )
        : null}
    </>
  );
}
