import { MarketingHero } from "@/app/(marketing)/_components/marketing-hero";
import { HomeContent } from "@/features/home";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 flex-col">
        <MarketingHero />
        <HomeContent />
      </main>
    </div>
  );
}
