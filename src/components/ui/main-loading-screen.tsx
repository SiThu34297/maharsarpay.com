import Image from "next/image";

type MainLoadingScreenProps = Readonly<{
  variant?: "page" | "navigation";
}>;

export function MainLoadingScreen({ variant = "page" }: MainLoadingScreenProps) {
  if (variant === "navigation") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white/15 px-4 backdrop-blur-md">
        <div className="flex min-w-[220px] flex-col items-center gap-3 px-7 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/90 shadow-[var(--shadow-soft)]">
            <Image
              src="/images/brand/maharsarpay-logo.png"
              alt="Mahar Sarpay logo"
              width={44}
              height={20}
              className="h-auto w-[44px] object-contain"
              priority
            />
          </div>
          <p className="animate-pulse text-2xl font-semibold tracking-[0.08em] text-[var(--color-brand)] sm:text-3xl">
            မဟာစာပေ
          </p>
          <div className="mt-1 flex items-center gap-1.5" aria-hidden>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-brand)] [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-brand)] [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-brand)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-page-bg)] px-4">
      <div className="flex flex-col items-center gap-4">
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
      </div>
    </div>
  );
}
