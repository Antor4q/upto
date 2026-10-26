import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Upto",
  description: "Freight that moves at the speed of your business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} font-[family-name:var(--font-sans)] antialiased`}>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}