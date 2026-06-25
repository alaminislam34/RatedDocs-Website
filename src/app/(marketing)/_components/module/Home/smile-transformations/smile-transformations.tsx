"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Static Data reflecting the design exactly
const CASE_STUDIES = [
  {
    id: 1,
    title: "Porcelain Venners", // Kept typo from design "Venners" intentionally to match 100%
    doctor: "Dr. Luiz Hernanded",
    location: "Istanbul, Turkey",
    patientType: "Verified RatedDocs Patient",
    // Replace with your real image paths
    image: "/images/smile-1.png",
  },
  {
    id: 2,
    title: "Composite Fillings",
    doctor: "Dr. Yoyo tez",
    location: "China, Beijieng",
    patientType: "Verified RatedDocs Patient",
    image: "/images/smile-2.png",
  },
  {
    id: 3,
    title: "Invisalign Treatment",
    doctor: "Dr. Rajesh Kumar",
    location: "Istanbul, Turkey",
    patientType: "Verified RatedDocs Patient",
    image: "/images/smile-3.png",
  },
];

export default function SmileTransformations() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? CASE_STUDIES.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === CASE_STUDIES.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="py-12 md:py-16 lg:py-24 font-sans antialiased">
      <div className="max-w-400 mx-auto w-11/12 space-y-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Smile Transformations That Matter for Everyone
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
              Every result shown here is tied to a patient who booked and paid
              directly through RatedDocs. The before photo was submitted by the
              patient at the time of booking. The after photo was submitted upon
              returning from treatment and reviewed by our team before
              publication.
            </p>
          </div>

          {/* <Button
            size={"lg"}
            className="self-start md:self-auto bg-primary text-white text-sm font-medium px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            See All Case Studies
            <span className="bg-[#FDB022] text-black rounded p-0.5 flex items-center justify-center size-4">
              <ArrowUpRight className="size-3 stroke-3" />
            </span>
          </Button> */}
        </div>

        {/* Desktop Grid / Mobile Responsive Slider Container */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col group transition-shadow duration-300 hover:shadow-sm"
              >
                {/* Image Frame Container */}
                <div className="relative w-full aspect-4/3 bg-gray-100 overflow-hidden">
                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-black text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="size-3.5 text-[#1570EF] fill-[#EFF8FF]" />
                    {study.patientType}
                  </div>

                  {/* Split Before/After Screen Showcase */}
                  <div className="absolute inset-0 flex">
                    <div className="relative w-full h-full border-r border-white/20">
                      <Image
                        src={study.image}
                        alt={`${study.title} Before`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Card Context Metrics Details */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white text-[#101828]">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#101828] tracking-tight">
                      {study.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {study.doctor}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
                    <svg
                      className="size-3.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {study.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Slider Control Utilities */}
        <div className="flex justify-end pt-4">
          <div className="inline-flex items-center gap-6 border border-gray-200 p-2 rounded-lg">
            <button
              onClick={handlePrev}
              className="bg-[#FDB022] hover:bg-[#F79009] text-black p-2 rounded-lg transition-colors duration-150 focus:outline-none"
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              className="bg-[#FDB022] hover:bg-[#F79009] text-black p-2 rounded-lg transition-colors duration-150 focus:outline-none"
              aria-label="Next slide"
            >
              <ArrowRight className="size-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
