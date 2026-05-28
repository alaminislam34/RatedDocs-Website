import Image from "next/image";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full bg-white py-12 lg:py-24">
      <div className="mx-auto flex max-w-360 w-11/12 flex-col items-center justify-between gap-12 lg:flex-row">
        
        <div className="w-full lg:w-3/5">
          <HeroContent />
        </div>

        <div className="relative w-full lg:w-2/5">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/hero.png"
              height={400}
              width={600}
              loading="eager"
              alt="Dental Clinic Entry"
              className="h-full w-full object-cover"
            />
            {/* Optional Overlay to match design warmth */}
            <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply" />
          </div>
        </div>

      </div>
    </section>
  );
}