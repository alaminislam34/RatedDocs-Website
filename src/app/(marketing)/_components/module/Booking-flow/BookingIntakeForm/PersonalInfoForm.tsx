"use client";
import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { getBookingData, updatePersonalInfo } from "@/lib/storage/bookingService";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Mexico",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Other",
];

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState(() => getBookingData().personalInfo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updatePersonalInfo(updated);
  };

  const labelCls = "block text-[#1A1A2E] font-medium text-sm mb-2.5";
  const inputCls =
    "w-full px-4 py-4 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113254]/10 focus:border-[#113254] placeholder-[#9EA9AA] transition-all bg-white";

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        Provide your personal Information
      </h2>

      <div className="space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter Name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Name"
              value={formData.lastName}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="johnsmith@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={inputCls}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className={labelCls}>
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              placeholder="MM/DD/YYYY"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`${inputCls} pr-12`}
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className={labelCls}>
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`${inputCls} appearance-none cursor-pointer pr-12`}
            >
              <option value="" disabled>
                Select Country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
