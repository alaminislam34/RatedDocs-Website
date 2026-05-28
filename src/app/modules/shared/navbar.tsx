import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { HamburgerButton } from "./hamburger-button";

export function Navbar() {
  return (
    <header className="border-b border-border/80 bg-white w-full">
      <nav className="px-4 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <HamburgerButton />
          <Image
            src={"/logos/mainlogo.png"}
            alt="Website logo"
            height={200}
            width={400}
            loading="eager"
            className="w-43 h-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0]">
              <Avatar className="h-10 w-10 border-2 border-gray-100">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:block">James William</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-54 space-y-2 p-4 mt-2"
            >
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  James William
                </p>
                <p className="text-xs text-[#6B7280]">
                  james.william@example.com
                </p>
              </div>
              <div className="border-b border-slate-200 my-2"></div>
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
