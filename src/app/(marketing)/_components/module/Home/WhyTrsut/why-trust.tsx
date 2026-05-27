"use client";

import { BadgeCheck, Users, Search, ClipboardCheck } from "lucide-react";

const trustFeatures = [
  {
    title: "Verified Dentists",
    description: "Only verified dentists make it onto RatedDocs.",
    icon: <BadgeCheck className="w-8 h-8 text-[#E3A32A]" />,
  },
  {
    title: "Trusted Expert Care",
    description: "Top-trained dentists. Trusted materials. Full transparency.",
    icon: <Users className="w-8 h-8 text-[#E3A32A]" />,
  },
  {
    title: "Transparent Pricing",
    description: "Transparent pricing. No surprises. Ever.",
    icon: <Search className="w-8 h-8 text-[#E3A32A]" />,
  },
  {
    title: "Real Patient Reviews",
    description: "Real reviews. Verified patients. Zero fake feedback.",
    icon: <ClipboardCheck className="w-8 h-8 text-[#E3A32A]" />,
  },
];

export default function WhyTrust() {
  return (
    <section className="py-20 bg-[#EEF8FF]">
      <div className="max-w-360 w-11/12 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#10436B]">
            Why Trust RatedDocs Verified Dentists?
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every dentist on RatedDocs undergoes a strict verification process,
            including license checks, to ensure your confidence when booking
            your next appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-6 group">
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                <div className="p-1 rounded-lg">{feature.icon}</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#10436B]">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
