"use client";

import useAuth from "@/hooks/authentication/useAuth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { logoutMutation } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    logoutMutation.mutate();
    router.push("/");
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 cursor-pointer"
      >
        <LogOut /> Logout
      </button>
    </div>
  );
};

export default LogoutButton;