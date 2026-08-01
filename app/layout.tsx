import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "เรียนรู้การสร้างโฟลว์ชาร์ต",
  description: "ฝึกสร้างโฟลว์ชาร์ตจากซูโดโค้ด พร้อมคำแนะนำจาก AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
