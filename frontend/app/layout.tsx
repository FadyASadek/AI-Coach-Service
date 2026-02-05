import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // استيراد خط كايرو
import "./globals.css";
import { ReactNode } from "react";

// إعداد خط كايرو
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "AI Coach Analyst | نظام تحليل بيانات اللاعبين",
  description: "تحليل ذكي لبيانات اللاعبين باستخدام Gemini AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning={true}> 
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning={true} className={cairo.className}>
        {children}
      </body>
    </html>
  );
}