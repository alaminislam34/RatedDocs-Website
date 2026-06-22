import { useFormContext } from "react-hook-form";
import { UploadCloud, Check } from "lucide-react";
import PhaseStep from "../PhaseStep";
import { useRef } from "react";

export const SterilizationSection = () => {
  const { setValue, watch } = useFormContext();
  const jciFile = watch("jciCertificate");
  const videoFile = watch("videoWalkthrough");

  const jciInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const methods = ["Autoclave", "Sealed Pouch", "Ultrasonic"];

  return (
    <section className="grid grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={1} title="Sterilization" />

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="inline-block text-sm font-medium text-foreground">
            Upload JCI Certificate
          </label>
          <input
            type="file"
            className="hidden"
            ref={jciInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                setValue("jciCertificate", file, { shouldValidate: true });
            }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div
            onClick={() => jciInputRef.current?.click()}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border bg-background px-4 py-4 transition-all hover:border-primary hover:bg-card sm:px-5"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {jciFile ? jciFile.name : "Click to upload or drag and drop"}
              </span>
            </div>
            {jciFile && (
              <span className="text-xs text-muted-foreground">
                {(jciFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <label className="inline-block text-sm font-medium text-foreground">
            Start Video Walkthrough
          </label>
          <input
            type="file"
            className="hidden"
            ref={videoInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                setValue("videoWalkthrough", file, { shouldValidate: true });
            }}
            accept="video/*"
          />
          <div
            onClick={() => videoInputRef.current?.click()}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border bg-background px-4 py-4 transition-all hover:border-primary hover:bg-card sm:px-5"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {videoFile ? videoFile.name : "Upload Video"}
              </span>
            </div>
            {videoFile && (
              <span className="text-xs text-muted-foreground">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm text-foreground">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Video Walkthrough Requirements
          </div>
          {methods.map((method) => (
            <div
              key={method}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors"
            >
              <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3" />
              </div>
              <span className="min-w-0">
                <span className="block font-medium text-foreground">
                  {method}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {method === "Autoclave" &&
                    "Film the brand name clearly for at least 3 seconds."}
                  {method === "Sealed Pouch" &&
                    "Show a sealed pouch with the chemical indicator clearly visible."}
                  {method === "Ultrasonic" &&
                    "Show the ultrasonic cleaner and your instrument trays."}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
