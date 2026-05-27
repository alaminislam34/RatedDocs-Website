import { useFormContext } from "react-hook-form";

export const GuaranteeSection = () => {
  const { register } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 py-10 border-t border-slate-100">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 3</span>
          <h2 className="text-2xl font-bold text-slate-800">No Surprise Guarantee</h2>
        </div>
        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
          <p className="text-sm leading-relaxed text-[#10436B] font-medium">
            The 15% rule means patients should not receive surprise increases beyond the disclosed starting price unless
            clearly explained and approved before treatment.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium inline-block text-[#414651]">Signer Full Name</label>
            <input
              {...register("signerFullName")}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-900 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium inline-block text-[#414651]">Typed Signature</label>
            <input
              {...register("typedSignature")}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-900 outline-none italic"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("agreeToGuarantee")}
            style={{ accentColor: "#0E3E65" }}
            className="w-4 h-4 rounded-xl border-slate-300 text-[#0E3E65] focus:ring-[#0E3E65]"
          />
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
            I agree to the No Surprise Guarantee and understand today's date is {new Date().toLocaleDateString()}.
          </span>
        </label>
      </div>
    </div>
  );
};