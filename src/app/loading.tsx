import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-page-bg)] px-4">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
          <div className="absolute -inset-2 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-brand)]" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]">
            <Image
              src="/images/brand/maharsarpay-logo.png"
              alt="Mahar Sarpay logo"
              width={70}
              height={31}
              className="h-auto w-[70px] object-contain"
              priority
            />
          </div>
        </div>
        <p className="text-sm font-medium tracking-wide text-[var(--color-text-muted)]">
          Loading...
        </p>
      </div>
    </div>
  );
}
