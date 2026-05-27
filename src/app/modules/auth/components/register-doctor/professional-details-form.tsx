"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profSchema = z.object({
  fullName: z.string().min(2, "Full legal name is required"),
  speciality: z.string().min(1, "Please select a speciality"),
  experience: z.string().min(1, "Years of experience is required"),
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "Please select a city"),
});

type ProfFormData = z.infer<typeof profSchema>;

export function ProfessionalDetailsForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfFormData>({
    resolver: zodResolver(profSchema),
  });

  const onSubmit = async (data: ProfFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Professional Details Submitted:", data);
      setStep(5);
    } catch (error) {
      toast.error("Failed to save details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2 text-left">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Full Legal Name
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="John Smith"
            className={`h-11 w-full border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.fullName ? "border-red-500" : ""}`}
          />
        </div>

        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">
            Primary Speciality
          </Label>
          <Select onValueChange={(val) => setValue("speciality", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.speciality ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Periodontist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="periodontist">
                Periodontist
              </SelectItem>
              <SelectItem className="h-11!" value="dentist">
                Dentist
              </SelectItem>
              <SelectItem className="h-11!" value="surgeon">
                Surgeon
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2 text-left">
        <Label
          htmlFor="experience"
          className="text-sm font-medium text-gray-700"
        >
          Years of Experience
        </Label>
        <Input
          id="experience"
          type="number"
          {...register("experience")}
          placeholder="8"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.experience ? "border-red-500" : ""}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">Country</Label>
          <Select onValueChange={(val) => setValue("country", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.country ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="USA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="usa">
                USA
              </SelectItem>
              <SelectItem className="h-11!" value="uk">
                UK
              </SelectItem>
              <SelectItem className="h-11!" value="canada">
                Canada
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">City</Label>
          <Select onValueChange={(val) => setValue("city", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.city ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="California" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="california">
                California
              </SelectItem>
              <SelectItem className="h-11!" value="new-york">
                New York
              </SelectItem>
              <SelectItem className="h-11!" value="texas">
                Texas
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-4  h-14 w-full bg-[#163E5C] text-white hover:bg-[#113149] rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? "Saving..." : "Create Account"}
      </Button>
    </form>
  );
}
