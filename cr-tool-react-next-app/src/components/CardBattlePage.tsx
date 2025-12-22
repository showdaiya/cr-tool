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
import { getInitialHp, getHpColorClass } from "@/utils/cardUtils";
import { cn } from "@/lib/utils";


type ActionButtonsProps = {
  onToggleInfo: () => void;
  onReset: () => void;
};

const ActionButtons = ({ onToggleInfo, onReset }: ActionButtonsProps) => (
  <div className="flex items-center gap-2">
    <Button variant="secondary" size="sm" onClick={onToggleInfo}>
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
  <div className="rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground">
    <p>
      <strong className="text-foreground">使い方:</strong> 防衛カードを選択し、攻撃カードを追加してダメージ計算を行います。計算結果は、防衛カードの残りHPとして表示されます。
    </p>
  </div>
);

const PageFooter = () => (
  <footer className="mt-10 border-t bg-card py-6">
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
  const { defenceCard, resetState, setDefenceCard, totalDamage, remainingHP, attackCards } = useCardContext();
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
  const initialHP = defenceCard ? getInitialHp(defenceCard) : 0;
  const hpPercentage = initialHP > 0 ? Math.max(0, Math.min(100, (remainingHP / initialHP) * 100)) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {shouldShowNotification && <DefenseNotification onSelectDefenseCard={() => setIsOpen(true)} />}

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
        <header className="rounded-2xl border border-accent/60 bg-gradient-to-br from-background via-card to-muted/50 p-4 shadow-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-base font-semibold">クラロワ ダメージシミュレーター</h1>
              <p className="text-xs text-muted-foreground">防衛を選ぶ → 攻撃を追加 → 回数を入力</p>
            </div>
            <ActionButtons onToggleInfo={() => setShowInfo((v) => !v)} onReset={resetCalculation} />
          </div>
          {showInfo && (
            <div className="mt-3">
              <InfoBox />
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-accent/40 bg-card/60 px-3 py-2 shadow-sm">
              <p className="text-[11px] text-muted-foreground">🛡️ 防衛</p>
              <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground">
                {defenceCard ? defenceCard.JpName : "未選択"}
              </p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-card/60 px-3 py-2 shadow-sm">
              <p className="text-[11px] text-muted-foreground">⚔️ 攻撃カード数</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                {attackCards.length}
              </p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-card/60 px-3 py-2 shadow-sm">
              <p className="text-[11px] text-muted-foreground">💥 合計ダメージ</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                {totalDamage}
              </p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-card/60 px-3 py-2 shadow-sm">
              <p className="text-[11px] text-muted-foreground">❤️ 残りHP</p>
              <p className={cn("mt-0.5 text-sm font-semibold tabular-nums", getHpColorClass(hpPercentage))}>
                {defenceCard ? remainingHP : "-"}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <section id="defense-card-section" ref={defenseCardRef} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">防衛カード</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="防衛カードの説明">
                      <span className="text-xs text-muted-foreground">?</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>防衛側のHPや残量を確認できます</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <DefenceCard onSelectClick={() => setIsOpen(true)} />
          </section>

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
