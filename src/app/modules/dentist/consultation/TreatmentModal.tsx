"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// Shadcn UI primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

const formSchema = z.object({
  procedures: z.array(
    z.object({
      name: z.string().min(1, "Required"),
      price: z.coerce.number().min(0),
      notes: z.string().optional(),
    }),
  ),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTreatmentPlanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      procedures: [
        {
          name: "Implant consultation",
          price: 250,
          notes: "Includes treatment plan review",
        },
        {
          name: "Implant consultation",
          price: 250,
          notes: "Includes treatment plan review",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });
  const watchProcedures = watch("procedures");
  const totalCost =
    watchProcedures?.reduce(
      (acc, curr) => acc + (Number(curr.price) || 0),
      0,
    ) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-275 w-[95vw] rounded-2xl overflow-y-auto p-0 overflow-hidden border-none shadow-2xl bg-white focus:outline-none">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200">
            <DialogTitle className="text-lg lg:text-xl font-semibold text-[#1A1A2E]">
              Create Treatment Plan
            </DialogTitle>
          </div>

          <form
            onSubmit={handleSubmit((d) => console.log(d))}
            className="max-h-200 overflow-y-auto"
          >
            {/* Patient Header Section */}
            <section className="px-8 py-10 bg-[#F9FAFB]">
              <div className="flex flex-col gap-8 items-start">
            
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-[#E8EEF2]">
                    <AvatarFallback className="text-[#5B7083] font-semibold text-xl">
                      AH
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold text-slate-900">
                        Jacob Smith
                      </h3>
                      <span className="px-3 py-1 bg-[#F0F2F5] text-[#6B7280] text-[12px] rounded-full border border-slate-200">
                        Not Sent
                      </span>
                    </div>
                    <p className="text-slate-500 text-[16px]">
                      Jacob.smith@sample.com
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Treatment Details with Vertical Dividers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 items-center w-full">
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Treatment Procedure
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        Dental Implants
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Appox Budget
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        $1254
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Traveling Dates
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        Wed 24 Jan, 2024
                      </p>
                    </div>
                  </div>
                  {/* Dental History Box */}
                  <div className="border border-slate-100 rounded-xl bg-white p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-sm font-semibold text-[#4A4A4C]">
                        Dental History
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-x divide-slate-100">
                      <div className="p-4">
                        <p className="text-[12px] text-[#6B7280] mb-1">
                          Last Visited
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          Wed 24 Jan, 2024
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-[12px] text-[#6B7280] mb-1">
                          Any existing dental conditions?
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          Bone loss,{" "}
                          <span className="font-normal text-slate-500">
                            Gum Disease
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Procedures Form Section */}
            <div className="px-8 space-y-6 py-4 bg-white">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      className="flex flex-col md:flex-row items-start gap-4 relative"
                    >
                      <div className="w-full md:w-[50%] space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Procedure 1
                        </label>
                        <Input
                          {...register(`procedures.${index}.name`)}
                          className="h-15 text-sm text-[#181D27] border-slate-200 rounded-lg bg-white focus-visible:ring-0"
                        />
                      </div>

                      <div className="w-full md:w-[50%] space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Pricing
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 rounded-l-lg top-0 bottom-0 w-8 bg-[#FAFAFA] flex items-center justify-center text-slate-400 border border-slate-200">
                            $
                          </span>
                          <Input
                            type="number"
                            {...register(`procedures.${index}.price`)}
                            className="h-15 pl-12 text-sm text-[#181D27] border-slate-200 overflow-hidden rounded-lg focus-visible:ring-0"
                          />
                        </div>
                      </div>

                      <div className="w-full md:grow space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Option Notes
                        </label>
                        <Input
                          {...register(`procedures.${index}.notes`)}
                          className="h-15 text-sm text-[#181D27] border-slate-200 rounded-lg focus-visible:ring-0"
                        />
                      </div>

                      <div className="pt-10 flex items-center h-full">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                          className="p-0 hover:bg-transparent"
                        >
                          <X className="h-7 w-7 text-slate-400" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Button
                type="button"
                onClick={() => append({ name: "", price: 0, notes: "" })}
                className="bg-[#0A3D5B] hover:bg-[#082f46] text-white font-semibold rounded-lg px-8 h-11 text-[16px]"
              >
                Add Procedure
              </Button>

              {/* Total Cost Row */}
              <div className="p-5 rounded-lg border border-slate-200 flex justify-between items-center bg-white">
                <span className="text-sm font-semibold text-[#4A4A4C]">Total Cost</span>
                <span className=" font-semibold text-[#0E3E65]">
                  ${totalCost}
                </span>
              </div>

              {/* Additional Information */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-[#6B7280] inline-block">
                  Any other information to share?
                </label>
                <Textarea
                  {...register("additionalInfo")}
                  placeholder="Care instructions, follow-up"
                  className="min-h-35 border-slate-200 rounded-xl p-4 text-[16px] resize-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <footer className="p-6 border-t border-slate-100 flex justify-end bg-white">
              <Button
                type="submit"
                className="bg-[#0E3E65] hover:bg-[#082f46] cursor-pointer text-white h-14 px-8 rounded-xl font-semibold"
              >
                Create plan and send to patient
              </Button>
            </footer>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
