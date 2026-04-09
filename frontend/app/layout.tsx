import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "CATTLEYA | Immense Beauty of Heaven",
  description: "CATTLEYA online batik clothing store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${inter.variable} font-body bg-cattleya-offwhite text-cattleya-black`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
