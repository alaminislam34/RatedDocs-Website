import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white via-slate-50 to-white flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem] opacity-40"></div>

      <div className="w-full max-w-3xl text-center relative">
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          Coming Soon
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          About{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500">
            Us
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
          We are currently crafting our story. This page will soon showcase our
          mission, our team, and the core values that drive us forward.
        </p>

        {/* Placeholder Content Card */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-8 sm:p-10 text-left transition-all hover:shadow-2xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center">
                <span className="h-6 w-1 bg-indigo-500 rounded-full mr-3"></span>
                Our Mission
              </h2>
              <p className="text-slate-600 leading-relaxed">
                To build innovative solutions that empower businesses and
                individuals to achieve more. We believe in simplicity,
                reliability, and delivering exceptional user experiences.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center">
                <span className="h-6 w-1 bg-blue-500 rounded-full mr-3"></span>
                Our Vision
              </h2>
              <p className="text-slate-600 leading-relaxed">
                To be the global standard for quality and innovation in our
                industry, creating a lasting positive impact on the communities
                and clients we serve.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-10 text-sm text-slate-500">
          Full team profiles, company history, and detailed milestones will be
          updated here shortly.
        </p>
      </div>
    </div>
  );
}
