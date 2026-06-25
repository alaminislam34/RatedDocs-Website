"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetDentistById } from "@/hooks/global/useGlobal";

const DentistProfile = dynamic(
  () =>
    import("../../_components/module/DentistAllComponents/DentistProfile/ProfilePage"),
  { ssr: false },
);

export default function ViewDentistProfile() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: dentist, isLoading, error } = useGetDentistById(slug);
  console.log(dentist);

  if (!dentist) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-[#003366]">Dentist Not Found</h1>
      </div>
    );
  }

  return (
    <main>
      <DentistProfile dentist={dentist} />
    </main>
  );
}
