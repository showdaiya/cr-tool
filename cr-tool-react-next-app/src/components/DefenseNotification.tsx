"use client";

import React, { KeyboardEvent, MouseEvent } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCardContext } from "@/context/CardContext";
import { getInitialHp } from "@/utils/cardUtils";
import { LOW_HP_THRESHOLD, MEDIUM_HP_THRESHOLD } from "@/constants";
import { cn } from "@/lib/utils";

type DefenseNotificationProps = {
  onSelectDefenseCard?: () => void;
};

const DefenseNotification = ({ onSelectDefenseCard }: DefenseNotificationProps) => {
  const { defenceCard, totalDamage, remainingHP } = useCardContext();

  const scrollToDefenseCard = () => {
    const defenseCardSection = document.getElementById("defense-card-section");
    if (defenseCardSection) {
      defenseCardSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 防衛カードが選択されていない場合
  if (!defenceCard) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "fixed left-1/2 top-3 z-50 w-[90%] max-w-[320px] -translate-x-1/2 rounded-md border",
          "bg-card px-3 py-2 text-left shadow-lg transition hover:-translate-y-[1px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
        onClick={scrollToDefenseCard}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToDefenseCard();
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            防衛カードが選択されていません
          </div>
          {onSelectDefenseCard && (
            <Button
              size="sm"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onSelectDefenseCard();
              }}
            >
              選択
            </Button>
          )}
        </div>
      </div>
    );
  }

  const initialHP = getInitialHp(defenceCard);
  const hpPercentage = initialHP > 0 ? (remainingHP / initialHP) * 100 : 0;
  
  const getHpColor = (percentage: number) => {
    if (percentage <= LOW_HP_THRESHOLD * 100) return "text-red-500";
    if (percentage <= MEDIUM_HP_THRESHOLD * 100) return "text-yellow-500";
    return "text-green-500";
  };
  
  const hpColor = getHpColor(hpPercentage);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "fixed left-1/2 top-3 z-50 w-[90%] max-w-[320px] -translate-x-1/2 rounded-md border",
        "bg-card px-3 py-2 text-left shadow-lg transition hover:-translate-y-[1px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      onClick={scrollToDefenseCard}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToDefenseCard();
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="line-clamp-1 text-sm font-semibold">{defenceCard.JpName}</p>
            {defenceCard.isEvo && (
              <Badge variant="outline" className="text-[10px]">
                EVO
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-[11px] text-muted-foreground">タップでスクロール</p>
        </div>
        <div className="flex items-center gap-4 text-right text-xs">
          <div>
            <p className="text-muted-foreground">受けたダメージ</p>
            <p className="text-sm font-semibold text-destructive">{totalDamage}</p>
          </div>
          <div>
            <p className="text-muted-foreground">残りHP</p>
            <p className={cn("text-sm font-bold", hpColor)}>{remainingHP}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseNotification;
