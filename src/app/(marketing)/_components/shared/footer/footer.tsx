"use client";

import { useStateContext } from "@/providers/StateProvider";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find a Dentist", href: "/find" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const resources = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  const { setKolModalOpen } = useStateContext();
  return (
    <footer className="bg-[#10436B] pt-20 pb-10 px-6 md:px-12 text-white">
      <div className="max-w-400 w-11/12 mx-auto">
        <div className="flex justify-between flex-wrap gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-1">
              <div className="">
                <Image
                  src={"/logos/whitelogo.png"}
                  alt="Website logo"
                  height={200}
                  width={400}
                  className="w-43 h-auto object-contain"
                />
              </div>
            </div>

            <p className="max-w-sm text-gray-300 text-[16px] leading-relaxed">
              Access fully-vetted dentists with clear pricing and guaranteed
              protection. Book your dental care with confidence today.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: <FaFacebook size={20} />, href: "#" },
                {
                  icon: <span className="font-bold text-lg italic">X</span>,
                  href: "#",
                },
                { icon: <FaInstagram size={20} />, href: "#" },
                { icon: <FaLinkedin size={20} />, href: "#" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 hover:bg-[#E3A32A] transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
            {/* <button
              onClick={() => setKolModalOpen(true)}
              className="inline-flex items-center overflow-hidden rounded-xl transition-opacity hover:opacity-90 active:scale-[0.98] bg-transparent text-white border-white border cursor-pointer px-4 space-x-2"
            >
              <span className="flex h-11.5 items-center text-sm font-semibold text-primary-foreground">
                Become a KOL Member
              </span>
              <ArrowUpRight
                className="size-6 p-1 rounded-md bg-[#E3A32A] text-primary"
                strokeWidth={2.5}
              />
            </button> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm tracking-wide">
            Copyright: "RatedDocs (c) 2026. All rights reserved."
          </p>
        </div>
      </div>
    </footer>
  );
}
