"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  country: z.string().min(1),
  city: z.string().min(1),
  authority: z.number().min(1),
  regNo: z.string().min(1),
});

interface LicenceFormProps {
  onVerify: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>> | null;
  isAlreadySubmitted: boolean;
}

export default function LicenceForm({
  onVerify,
  defaultValues,
  isAlreadySubmitted,
}: LicenceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: defaultValues?.country || "USA",
      city: defaultValues?.city || "California",
      authority: defaultValues?.authority || 0,
      regNo: defaultValues?.regNo || "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        country: defaultValues.country || "USA",
        city: defaultValues.city || "California",
        authority: defaultValues.authority || 0,
        regNo: defaultValues.regNo || "",
      });
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">Country</Label>
          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <Select
                disabled={isAlreadySubmitted}
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="px-2">
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="Dubai">Dubai</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Switzerland">Switzerland</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="South Korea">South Korea</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="Nepal">Nepal</SelectItem>
                  <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                  <SelectItem value="Bhutan">Bhutan</SelectItem>
                  <SelectItem value="Maldives">Maldives</SelectItem>
                  <SelectItem value="Mauritius">Mauritius</SelectItem>
                  <SelectItem value="Seychelles">Seychelles</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">City</Label>
          <Controller
            name="city"
            control={form.control}
            render={({ field }) => (
              <Select
                disabled={isAlreadySubmitted}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="San Diego">San Diego</SelectItem>
                  <SelectItem value="Sacramento">Sacramento</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">
            Registration Authority
          </Label>
          <Controller
            name="authority"
            control={form.control}
            render={({ field }) => (
              <Select
                disabled={isAlreadySubmitted}
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Authority" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  <SelectItem value="1">California Medical Board</SelectItem>
                  <SelectItem value="2">Medical Board of California</SelectItem>
                  <SelectItem value="3">California Dental Board</SelectItem>
                  <SelectItem value="4">
                    California Board of Pharmacy
                  </SelectItem>
                  <SelectItem value="5">California Board of Nursing</SelectItem>
                  <SelectItem value="6">
                    California Board of Psychology
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">
            Registration No
          </Label>
          <Input
            disabled={isAlreadySubmitted}
            {...form.register("regNo")}
            className="h-14 rounded-xl border-border bg-card px-4 py-0"
            placeholder="Enter Reg No"
          />
        </div>
      </div>
      <Button
        disabled={isAlreadySubmitted}
        type="submit"
        className="h-12 rounded-lg px-10 font-semibold"
      >
        {isAlreadySubmitted ? "Submitted" : "Verify"}
      </Button>
    </form>
  );
}
