"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

// ─── Section data ──────────────────────────────────────────────────────────────

const FEATURES = [
  "Biometric Facial Mapping",
  "AI-Augmented Bone Density Prediction",
  "Direct specialist matching based on results",
];

// ─── Facial triangulation mesh (viewBox 0 0 100 100) ──────────────────────────
// Left half — cyan (approximate landmark triangulation, left side of face)
const L_POLYS = [
  "10,28 20,18 30,22",
  "20,18 30,22 36,12",
  "10,28 16,42 20,18",
  "20,18 28,38 30,22 16,42",
  "30,22 40,30 28,38",
  "40,30 46,44 36,52 28,38",
  "16,42 22,56 28,38",
  "28,38 30,60 36,52 22,56",
  "36,52 44,60 46,44 30,60",
  "22,56 17,64 24,70 30,60",
  "30,60 24,70 32,74 44,60 42,70",
  "24,70 20,78 28,82 32,74",
  "17,64 20,78 24,70",
];

// Right half — pink/fuchsia (mirrored)
const R_POLYS = [
  "90,28 80,18 70,22",
  "80,18 70,22 64,12",
  "90,28 84,42 80,18",
  "80,18 72,38 70,22 84,42",
  "70,22 60,30 72,38",
  "60,30 54,44 64,52 72,38",
  "84,42 78,56 72,38",
  "72,38 70,60 64,52 78,56",
  "64,52 56,60 54,44 70,60",
  "78,56 83,64 76,70 70,60",
  "70,60 76,70 68,74 56,60 58,70",
  "76,70 80,78 72,82 68,74",
  "83,64 80,78 76,70",
];

// Vertex glow dots — left (cyan)
const L_DOTS: [number, number][] = [
  [10, 28],
  [20, 18],
  [30, 22],
  [36, 12],
  [16, 42],
  [28, 38],
  [40, 30],
  [46, 44],
  [22, 56],
  [36, 52],
  [30, 60],
  [44, 60],
  [17, 64],
  [24, 70],
  [32, 74],
  [28, 82],
  [20, 78],
];

// Vertex glow dots — right (fuchsia)
const R_DOTS: [number, number][] = [
  [90, 28],
  [80, 18],
  [70, 22],
  [64, 12],
  [84, 42],
  [72, 38],
  [60, 30],
  [54, 44],
  [78, 56],
  [64, 52],
  [70, 60],
  [56, 60],
  [83, 64],
  [76, 70],
  [68, 74],
  [72, 82],
  [80, 78],
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AiSmilePreview() {
  const [imgVisible, setImgVisible] = useState(true);

  const handleTryPreview = () => {
    toast("AI Smile Preview coming soon — upload your photo to begin.", {
      icon: "✨",
      style: {
        background: "#0e3e65",
        color: "#ffffff",
        borderRadius: "12px",
        fontSize: "14px",
      },
    });
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl w-11/12 space-y-14">
        {/* ── Top: 2-column content row ── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading + description + button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="space-y-7"
          >
            <h2 className="font-heading text-[2.5rem] font-black leading-[1.08] tracking-tight text-foreground lg:text-[2.75rem]">
              Visualize your ideal smile <br className="hidden sm:block" />
              instantly.
            </h2>

            <p className="max-w-110 text-[15px] leading-relaxed text-muted-foreground">
              Our proprietary Neural-Dental engine analyzes your facial
              structure to simulate perfect symmetry. Upload a single photo and
              receive a full 3D simulation of your recommended procedures within
              seconds.
            </p>

            {/* Split button — navy text area + gold icon area */}
            <button
              onClick={handleTryPreview}
              className="inline-flex items-center overflow-hidden rounded-xl transition-opacity hover:opacity-90 active:scale-[0.98] bg-primary px-4 space-x-2"
            >
              <span className="flex h-11.5 items-center text-sm font-semibold text-primary-foreground">
                Try AI Smile Preview
              </span>
              <ArrowUpRight
                className="size-6 p-1 rounded-md bg-[#E3A32A] text-primary"
                strokeWidth={2.5}
              />
            </button>
          </motion.div>

          {/* Right: feature list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="size-4.5 shrink-0 rounded-full border-[1.5px] border-gray-300" />
                <span className="text-[15px] font-medium text-foreground">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom: AI visualization card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            aspectRatio: "2 / 1",
            background:
              "linear-gradient(180deg, #0f1b2d 0%, #071018 50%, #0a1622 100%)",
          }}
        >
          {/* Actual image — shown when /public/images/ai-smile.png is present */}
          {imgVisible && (
            <Image
              src="/images/ai-smile-preview.png"
              fill
              alt="AI Smile Preview — facial mapping visualization"
              className="object-cover"
              onError={() => setImgVisible(false)}
              priority
            />
          )}

          {/* Left-half subtle cyan tonal layer */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-cyan-500/4" />
          {/* Right-half subtle fuchsia tonal layer */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-fuchsia-500/4" />

          {/* ── Facial mesh SVG overlay ── */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Left — cyan triangulation */}
            {L_POLYS.map((pts, i) => (
              <polygon
                key={`lp${i}`}
                points={pts}
                fill="none"
                stroke="rgb(34 211 238)"
                strokeWidth="0.22"
                strokeOpacity="0.6"
              />
            ))}
            {L_DOTS.map(([cx, cy], i) => (
              <circle
                key={`ld${i}`}
                cx={cx}
                cy={cy}
                r="0.55"
                fill="rgb(34 211 238)"
                fillOpacity="0.85"
              />
            ))}

            {/* Right — fuchsia/pink triangulation */}
            {R_POLYS.map((pts, i) => (
              <polygon
                key={`rp${i}`}
                points={pts}
                fill="none"
                stroke="rgb(240 114 255)"
                strokeWidth="0.22"
                strokeOpacity="0.6"
              />
            ))}
            {R_DOTS.map(([cx, cy], i) => (
              <circle
                key={`rd${i}`}
                cx={cx}
                cy={cy}
                r="0.55"
                fill="rgb(240 114 255)"
                fillOpacity="0.85"
              />
            ))}

            {/* Center vertical split line */}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="rgb(34 211 238)"
              strokeWidth="0.28"
              strokeOpacity="0.9"
            />
          </svg>

          {/* Scan focus frame — bracket corners */}
          <div
            className="pointer-events-none absolute border border-cyan-400/50"
            style={{ top: "18%", left: "32%", width: "36%", height: "64%" }}
          >
            {/* Top-left corner bracket */}
            <div className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-cyan-400" />
            {/* Top-right corner bracket */}
            <div className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-cyan-400" />
            {/* Bottom-left corner bracket */}
            <div className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-cyan-400" />
            {/* Bottom-right corner bracket */}
            <div className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-cyan-400" />
          </div>

          {/* Center split glow dot */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_6px_rgb(34_211_238/0.4)]" />

          {/* Animated horizontal scan line */}
          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"
            style={{ top: "20%" }}
            animate={{ top: ["20%", "76%", "20%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
