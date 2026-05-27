"use client";

import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import { X, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

// ─── Schema ────────────────────────────────────────────────────────────────────
const procedureSchema = z.object({
  name: z.string().min(1, "Procedure name is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  notes: z.string().optional(),
});

const formSchema = z.object({
  procedures: z.array(procedureSchema).min(1, "At least one procedure required"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Props ─────────────────────────────────────────────────────────────────────
interface PatientInfo {
  name: string;
  email: string;
  initials: string;
  procedure: string;
  budget: string;
  travelDates: string;
  lastVisited: string;
  conditions: string;
}

interface CreateFinalTreatmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormValues) => void;
  estimateTotal?: string;
  patient?: PatientInfo;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CreateFinalTreatmentPlanModal({
  isOpen,
  onClose,
  onSubmit,
  estimateTotal = "$1,200",
  patient = {
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "AH",
    procedure: "Dental Implants",
    budget: "$1,200",
    travelDates: "Wed 24 Jan, 2024",
    lastVisited: "Wed 24 Jan, 2024",
    conditions: "Bone loss, Gum Disease",
  },
}: CreateFinalTreatmentPlanModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      procedures: [
        { name: "Implant consultation", price: 250, notes: "Includes treatment plan review" },
        { name: "Implant consultation", price: 250, notes: "Includes treatment plan review" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "procedures" });

  const watchedProcedures = watch("procedures");
  const finalTotal = watchedProcedures?.reduce((sum, p) => sum + (Number(p.price) || 0), 0) || 0;

  // Parse estimate to number for range check
  const estimateNum = parseFloat(estimateTotal.replace(/[^0-9.]/g, "")) || 1200;
  const withinRange = finalTotal <= estimateNum * 1.15;

  const handleFormSubmit = (data: FormValues) => {
    onSubmit?.(data);
    onClose();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
        <DialogContent className="w-[95vw] max-w-3xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white focus:outline-none max-h-[95vh] flex flex-col">
          {/* ── Modal Header ── */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-lg font-bold text-[#1A1A2E]">
              Create Final Treatment Plan
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="overflow-y-auto flex-1"
          >
            {/* ── Patient Info Section ── */}
            <section className="px-7 py-6 bg-[#F9FAFB]">
              {/* Avatar + Name + Email */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E8EEF2] flex items-center justify-center text-[#5B7083] font-bold text-base shrink-0">
                  {patient.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
                  <p className="text-sm text-slate-500">{patient.email}</p>
                </div>
              </div>

              {/* Procedure info + Dental History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Treatment Details */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-[#777779] font-medium">Treatment Procedure</p>
                    <p className="text-sm font-semibold text-[#111113]">{patient.procedure}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#777779] font-medium">Appox Budget</p>
                    <p className="text-sm font-semibold text-[#111113]">{patient.budget}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#777779] font-medium">Traveling Dates</p>
                    <p className="text-sm font-semibold text-[#111113]">{patient.travelDates}</p>
                  </div>
                </div>

                {/* Dental History Box */}
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-[#4A4A4C]">Dental History</p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-100">
                    <div className="p-3">
                      <p className="text-[11px] text-[#6B7280] mb-1">Last Visited</p>
                      <p className="text-[13px] font-bold text-slate-800">{patient.lastVisited}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] text-[#6B7280] mb-1">Any existing dental conditions?</p>
                      <p className="text-[13px] font-bold text-slate-800">{patient.conditions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="px-7 py-5 space-y-6 bg-white">
              {/* ── Estimate Section ── */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Estimate</h4>
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm text-slate-600">Estimate Total</span>
                  <span className="text-sm font-bold text-[#0A2540]">{estimateTotal}</span>
                </div>
              </div>

              {/* ── Upload Test File ── */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Upload Test File</h4>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isDragging
                      ? "border-[#163E5C] bg-[#F0F5FA]"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  {uploadedFile ? (
                    <p className="text-sm text-[#163E5C] font-medium">{uploadedFile.name}</p>
                  ) : (
                    <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* ── Procedure Rows ── */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-4">
                  Create Final Treatment Plan
                </h4>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end"
                      >
                        {/* Procedure Name */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-[#414651]">
                            Procedure {index + 1}
                          </label>
                          <Input
                            {...register(`procedures.${index}.name`)}
                            placeholder="Procedure name"
                            className="h-12 text-sm border-slate-200 rounded-lg bg-white focus-visible:ring-0"
                          />
                          {errors.procedures?.[index]?.name && (
                            <p className="text-xs text-red-500">
                              {errors.procedures[index]?.name?.message}
                            </p>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="space-y-1.5 w-full sm:w-36">
                          <label className="text-xs font-medium text-[#414651]">Pricing</label>
                          <div className="relative">
                            <span className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-slate-400 text-sm border-r border-slate-200 bg-slate-50 rounded-l-lg">
                              $
                            </span>
                            <Input
                              type="number"
                              min={0}
                              {...register(`procedures.${index}.price`)}
                              className="h-12 pl-11 text-sm border-slate-200 rounded-lg focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        {/* Option Notes */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-[#414651]">Option Notes</label>
                          <Input
                            {...register(`procedures.${index}.notes`)}
                            placeholder="e.g. Includes treatment plan review"
                            className="h-12 text-sm border-slate-200 rounded-lg focus-visible:ring-0"
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-center pb-0.5">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30"
                            aria-label="Remove procedure"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <Button
                  type="button"
                  onClick={() => append({ name: "", price: 0, notes: "" })}
                  className="mt-4 bg-[#0A3D5B] hover:bg-[#082f46] text-white font-semibold rounded-lg px-6 h-11 text-sm"
                >
                  Add Procedure
                </Button>
              </div>

              {/* ── Final Total ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">Final Total</span>
                  {withinRange ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Within 15% protected range
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Exceeds 15% — patient eligible for refund
                    </span>
                  )}
                </div>
                <span className="text-base font-bold text-[#0A2540]">${finalTotal.toLocaleString()}</span>
              </div>

              {/* ── Disclaimer ── */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-sm text-blue-700 text-center">
                  No treatment can begin until the patient confirms this final plan.
                </p>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-7 py-5 border-t border-slate-100 flex justify-end bg-white shrink-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0E3E65] hover:bg-[#082f46] text-white h-12 px-8 rounded-xl font-semibold text-sm"
              >
                {isSubmitting ? "Submitting…" : "Submit Final Treatment Plan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
