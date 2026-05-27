import { X } from "lucide-react";
import { Consultation, TabType } from "./type";

interface CardProps {
  data: Consultation;
  type: TabType;
  CreateTreatmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTreatmentModalOpen: boolean;
}

export const ConsultationCard = ({
  data,
  type,
  onClick,
  CreateTreatmentModalOpen,
  isTreatmentModalOpen,
}: CardProps & { onClick: () => void }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Avatar & Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#163E5C] font-bold text-sm">
          {data.patientName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h3 className="font-bold text-[#111113] text-lg">
            {data.patientName}
          </h3>
          <p className="text-sm text-slate-500 font-medium">{data.email}</p>
        </div>
      </div>

      <hr className="border-slate-50 mb-4" />

      {type === "Treatment Estimate" && data.treatmentPlanStatus && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-[#111113]">
            Treatment Plan Status
          </span>
          <span
            className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
              data.treatmentPlanStatus === "Not Sent"
                ? "bg-slate-100 text-[#777779]"
                : data.treatmentPlanStatus === "Rejected"
                  ? "bg-red-50 text-red-500"
                  : "bg-orange-50 text-orange-500"
            }`}
          >
            {data.treatmentPlanStatus}
          </span>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-6 mb-8">
        <div>
          <p className="text-xs text-[#777779] mb-1">Treatment Procedure</p>
          <p className="text-sm font-bold text-[#111113]">{data.procedure}</p>
        </div>
        <div>
          <p className="text-xs text-[#777779] mb-1">Appox Budget</p>
          <p className="text-sm font-bold text-[#111113]">{data.budget}</p>
        </div>
        <div>
          <p className="text-xs text-[#777779] mb-1">Date</p>
          <p className="text-sm font-bold text-[#111113]">{data.date}</p>
        </div>
        <div>
          <p className="text-xs text-[#777779] mb-1">Time slot</p>
          <p className="text-sm font-bold text-[#111113]">{data.timeSlot}</p>
        </div>
      </div>

      {/* Dynamic Buttons based on Tab */}
      <div className="flex gap-3">
        <button
          onClick={onClick}
          className="flex-1 h-11 border border-[#163E5C] text-[#163E5C] rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
        >
          View Details
        </button>

        {type === "Active" &&
          (data.id === "5" ? ( // Example logic for different buttons in image 470877.png
            <button className="flex-1 h-11 bg-[#0A2540] text-white rounded-xl font-bold text-sm hover:opacity-90">
              Join Meeting
            </button>
          ) : (
            <button className="flex-1 h-11 bg-[#10B981] text-white rounded-xl font-bold text-sm hover:opacity-90">
              Mark as Complete
            </button>
          ))}

        {type === "Treatment Estimate" && (
          <button
            onClick={() => CreateTreatmentModalOpen(true)}
            className="flex-1 h-11 bg-[#0A2540] text-white rounded-xl font-bold text-sm hover:opacity-90"
          >
            {data.treatmentPlanStatus === "Not Sent"
              ? "Create Treatment Plan"
              : "Update Treatment Plan"}
          </button>
        )}
      </div>
    </div>
  );
};
