"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  country: z.string().min(1),
  city: z.string().min(1),
  authority: z.string().min(1),
  regNo: z.string().min(1),
});

export default function LicenceForm({ onVerify }: { onVerify: (data: any) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { country: "USA", city: "California", authority: "", regNo: "" },
  });

  return (
    <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">Country</Label>
          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Label className="font-semibold text-muted-foreground">Registration Authority</Label>
          <Controller
            name="authority"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Authority" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  <SelectItem value="California Medical Board">California Medical Board</SelectItem>
                  <SelectItem value="Medical Board of California">Medical Board of California</SelectItem>
                  <SelectItem value="California Dental Board">California Dental Board</SelectItem>
                  <SelectItem value="California Board of Pharmacy">California Board of Pharmacy</SelectItem>
                  <SelectItem value="California Board of Nursing">California Board of Nursing</SelectItem>
                  <SelectItem value="California Board of Psychology">California Board of Psychology</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">Registration No</Label>
          <Input {...form.register("regNo")} className="h-14 rounded-xl border-border bg-card px-4 py-0" placeholder="Enter Reg No" />
        </div>
      </div>
      <Button type="submit" className="h-12 rounded-lg px-10 font-semibold">
        Verify
      </Button>
    </form>
  );
}