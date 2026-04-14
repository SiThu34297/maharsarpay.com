import Image from "next/image";

type MarketingTopBrandStripProps = Readonly<{
  title: string;
  message: string;
}>;

export function MarketingTopBrandStrip({ title, message }: MarketingTopBrandStripProps) {
  return (
    <section className="border-b border-[var(--color-border)] bg-white">
      <div className="home-shell py-4 md:py-5">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
          <Image
            src="/images/brand/maharsarpay-logo.png"
            alt="မဟာစာပေ logo"
            width={500}
            height={219}
            className="h-16 w-auto object-contain md:h-20"
            priority
          />
          <h2 className="text-2xl font-semibold text-[var(--color-text-main)] md:text-3xl">
            {title}
          </h2>
          <p className="max-w-3xl text-sm text-[var(--color-text-muted)] md:text-base">{message}</p>
        </div>
      </div>
    </section>
  );
}
