import type React from "react";
import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

// Zen Maru Gothicフォントをインポート
const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "700"], // 必要に応じて太さを指定
  display: "swap",
});

export const metadata: Metadata = {
  title: "ふたりのAIさん",
  description: "AIチャット振り返りアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={zenMaruGothic.className}>
      <body>{children}</body>
    </html>
  );
}