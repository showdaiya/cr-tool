"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AttackCardSection from "./AttackCardSection";
import DefenceCard from "./DefenceCard";
import SelectCardOverlay from "./SelectCardOverlay";
import DefenseNotification from "./DefenseNotification";
import { useCardContext } from "@/context/CardContext";
import { AnyCard } from "@/types/CardTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const PageHeader = () => (
  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center shadow-md opacity-90">
    <h1 className="text-lg font-semibold text-white leading-tight">
      クラロワ
      <br />
      ダメージシミュレーター
    </h1>
  </div>
);

type ActionButtonsProps = {
  onToggleInfo: () => void;
  onReset: () => void;
};

const ActionButtons = ({ onToggleInfo, onReset }: ActionButtonsProps) => (
  <div className="flex items-center justify-center gap-4">
    <Button variant="ghost" size="sm" onClick={onToggleInfo}>
      <Info className="mr-2 h-4 w-4" />
      ヘルプ
    </Button>
    <Button variant="outline" size="sm" onClick={onReset}>
      <RotateCcw className="mr-2 h-4 w-4" />
      リセット
    </Button>
  </div>
);

const InfoBox = () => (
  <div className="rounded-lg border bg-muted px-3 py-2 text-xs text-foreground/80">
    <p>
      <strong>使い方:</strong> 防衛カードを選択し、攻撃カードを追加してダメージ計算を行います。計算結果は、防衛カードの残りHPとして表示されます。
    </p>
  </div>
);

const PageFooter = () => (
  <footer className="mt-10 border-t bg-muted py-6">
    <div className="mx-auto max-w-3xl px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-muted-foreground">© 2024-2025 クラロワ ダメージシミュレーター</p>
        <p className="text-[10px] text-muted-foreground">
          カードデータ出典:{" "}
          <a
            href="https://clashroyale.fandom.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Clash Royale Wiki (Fandom)
          </a>{" "}
          - CC-BY-SA 3.0
        </p>
        <p className="text-[10px] text-muted-foreground">
          ※ 本ツールはファン作成の非公式ツールです。Supercellとは一切関係ありません。
        </p>
      </div>
    </div>
  </footer>
);

const CardBattlePage = () => {
  const { defenceCard, resetState, setDefenceCard } = useCardContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDefenseCardVisible, setIsDefenseCardVisible] = useState(true);
  const defenseCardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleVisibilityChange = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]) setIsDefenseCardVisible(entries[0].isIntersecting);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && defenseCardRef.current) {
      const currentElement = defenseCardRef.current;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(handleVisibilityChange, {
        root: null,
        threshold: 0.5,
      });
      observerRef.current.observe(currentElement);

      const currentObserver = observerRef.current;
      return () => currentObserver.disconnect();
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [mounted, handleVisibilityChange]);

  const resetCalculation = () => resetState();
  if (!mounted) return null;

  const shouldShowNotification = !isDefenseCardVisible || !defenceCard;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {shouldShowNotification && <DefenseNotification onSelectDefenseCard={() => setIsOpen(true)} />}

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
        <PageHeader />

        <ActionButtons onToggleInfo={() => setShowInfo((v) => !v)} onReset={resetCalculation} />

        {showInfo && <InfoBox />}

        <div className="space-y-6">
          <div id="defense-card-section" ref={defenseCardRef} className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">防衛カード</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-xs text-muted-foreground">?</span>
                </TooltipTrigger>
                <TooltipContent>防衛側のHPや残量を確認できます</TooltipContent>
              </Tooltip>
            </div>
            <DefenceCard onSelectClick={() => setIsOpen(true)} />
          </div>

          <AttackCardSection />
        </div>

        <SelectCardOverlay
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          modalTitle="防衛カードを選択"
          cardFilter={(card) => card.defence === true}
          allowedCardTypes={["Troop", "Building"]}
          onConfirm={(selected) => {
            if ("cardId" in selected && "attackNumbers" in selected) {
              console.error("Unexpected AttackCardState received for defence selection.");
            } else {
              setDefenceCard(selected as AnyCard);
            }
          }}
          initialSelectedCard={defenceCard}
        />
      </main>

      <PageFooter />
    </div>
  );
};

export default CardBattlePage;
