"use client";

import dynamic from "next/dynamic";
import { CardProvider } from "@/context/CardContext";
import ErrorBoundary from "@/components/ErrorBoundary"; // Import ErrorBoundary
import { TooltipProvider } from "@/components/ui/tooltip";

// サーバーコンポーネントではなくクライアントコンポーネントとして読み込む
const CardBattlePage = dynamic(() => import("@/components/CardBattlePage"), {
  ssr: false,
});

export default function Home() {
  return (
    <CardProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <CardBattlePage />
        </ErrorBoundary>
      </TooltipProvider>
    </CardProvider>
  );
}
