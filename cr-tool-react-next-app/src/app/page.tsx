"use client";

import dynamic from "next/dynamic";
import { CardProvider } from "@/context/CardContext";
import ChakraProvider from "@/context/ChakraProvider";
import ErrorBoundary from "@/components/ErrorBoundary"; // Import ErrorBoundary

// サーバーコンポーネントではなくクライアントコンポーネントとして読み込む
const CardBattlePage = dynamic(() => import("@/components/CardBattlePage"), {
  ssr: false,
});

export default function Home() {
  return (
    <ChakraProvider>
      <CardProvider>
        <ErrorBoundary>
          <CardBattlePage />
        </ErrorBoundary>
      </CardProvider>
    </ChakraProvider>
  );
}
