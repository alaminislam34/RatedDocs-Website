import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/providers/StateProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RatedDocs",
  description:
    "Discover top-rated dentists with transparent pricing on RatedDocs. Compare verified dental professionals, read reviews, and book confidently for your oral health needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
