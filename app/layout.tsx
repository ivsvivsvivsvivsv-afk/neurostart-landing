import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "НЕЙРО-ЮНИТ — Бесплатный урок",
  description: "Попробуй платформу персонализированного ИИ-образования",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
