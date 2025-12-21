import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "@/app/globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "クラロワ ダメージ計算ツール",
  description:
    "クラッシュロワイヤルのカードダメージを計算できるシミュレーションツール。攻撃カードと防衛カードを選択して、残りHPをリアルタイムで確認できます。",
  keywords: [
    "クラッシュロワイヤル",
    "クラロワ",
    "ダメージ計算",
    "シミュレーター",
    "Clash Royale",
    "damage calculator",
  ],
  authors: [{ name: "showdaiya" }],
  openGraph: {
    title: "クラロワ ダメージ計算ツール",
    description:
      "クラッシュロワイヤルのカードダメージを計算できるシミュレーションツール",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "クラロワ ダメージ計算ツール",
    description:
      "クラッシュロワイヤルのカードダメージを計算できるシミュレーションツール",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.variable}>{children}</body>
    </html>
  );
}
