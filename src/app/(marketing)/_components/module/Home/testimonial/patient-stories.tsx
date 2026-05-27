"use client";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "./testimonial-card";

const STORIES = [
  {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    text: "I compared dentists, booked online, and everything from consultation to aftercare was clearly guided.",
    name: "Emma",
    treatment: "Smile Design in Turkey"
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600",
    text: "Seeing the dentist's licence, materials, and verified data gave me confidence before booking. No hidden surprises at all.",
    name: "James",
    treatment: "Implant in Turkey"
  },
  {
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600",
    text: "I knew the full price before I travelled based on my estimate. The whole process was seamless.",
    name: "Sara",
    treatment: "Veneers in Mexico"
  },
  {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    text: "I compared dentists, booked online, and everything from consultation to aftercare was clearly guided.",
    name: "Emma",
    treatment: "Smile Design in Turkey"
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600",
    text: "Seeing the dentist's licence, materials, and verified data gave me confidence before booking. No hidden surprises at all.",
    name: "James",
    treatment: "Implant in Turkey"
  },
  {
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600",
    text: "I knew the full price before I travelled based on my estimate. The whole process was seamless.",
    name: "Sara",
    treatment: "Veneers in Mexico"
  }
];

export default function PatientStories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    skipSnaps: false 
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-360 w-11/12 mx-auto">
        
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-[#10436B] mb-4">Patient Stories</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              See how patients compared verified dentists, knew the cost upfront, and travelled with confidence.
            </p>
          </div>
          
          <div className="hidden md:flex gap-3 mb-2">
            <button 
              onClick={scrollPrev}
              className=" flex items-center justify-center text-gray-400 hover:border-[#10436B] hover:text-[#10436B] transition-all"
            >
              <ChevronLeft size={25} />
            </button>
            <button 
              onClick={scrollNext}
              className=" flex items-center justify-center text-gray-400 hover:border-[#10436B] hover:text-[#10436B] transition-all"
            >
              <ChevronRight size={25} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className=" cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4">
            {STORIES.map((story, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                <TestimonialCard {...story} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-6 mt-10 md:hidden">
            <button onClick={scrollPrev} className="text-[#10436B] font-bold underline">Prev</button>
            <button onClick={scrollNext} className="text-[#10436B] font-bold underline">Next</button>
        </div>
      </div>
    </section>
  );
}