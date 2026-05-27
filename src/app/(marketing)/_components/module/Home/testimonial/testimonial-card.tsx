"use client";
import { Star, Play } from "lucide-react";

interface TestimonialProps {
  image: string;
  text: string;
  name: string;
  treatment: string;
}

export default function TestimonialCard({
  image,
  text,
  name,
  treatment,
}: TestimonialProps) {
  return (
    <div className="rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center h-full mx-2">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 group cursor-pointer">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 transition-transform group-hover:scale-110">
            <Play fill="white" className="text-white ml-1" size={20} />
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} fill="#E3A32A" className="text-[#E3A32A]" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-1">
        "{text}"
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-4" />

      {/* Identity */}
      <div>
        <h4 className="font-bold text-[#10436B] text-lg">{name}</h4>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">
          {treatment}
        </p>
      </div>
    </div>
  );
}
