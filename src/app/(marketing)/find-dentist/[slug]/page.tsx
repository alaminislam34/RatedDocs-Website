"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { dentists } from "../../_components/module/DentistAllComponents/types";

const DentistProfile = dynamic(
  () =>
    import("../../_components/module/DentistAllComponents/DentistProfile/ProfilePage"),
  { ssr: false },
);

export default function ViewDentistProfile() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Or a loading skeleton

  const slug = params?.slug as string;
  const dentist = dentists.find((d) => d.id === slug);

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
