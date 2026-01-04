"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCardContext } from "@/context/CardContext";
import { getInitialHp, getCardImageFilename } from "@/utils/cardUtils";
import { LOW_HP_THRESHOLD, MEDIUM_HP_THRESHOLD } from "@/constants";
import { cn } from "@/lib/utils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type DefenceCardProps = {
  onSelectClick: () => void;
};

const DefenceCardComponent = ({ onSelectClick }: DefenceCardProps) => {
  const { defenceCard, totalDamage, remainingHP } = useCardContext();

  if (!defenceCard) {
    return (
      <Card className="flex min-h-[150px] items-center justify-center border-dashed">
        <Button onClick={onSelectClick} size="sm">
          防衛カードを選択
        </Button>
      </Card>
    );
  }

  const initialHP = getInitialHp(defenceCard);
  const hpPercentage = initialHP > 0 ? (remainingHP / initialHP) * 100 : 0;

  const badgeText =
    defenceCard.cardType === "Troop"
      ? "ユニット"
      : defenceCard.cardType === "Building"
        ? "建物"
        : "呪文";

  const getHpState = (percentage: number): "low" | "medium" | "high" => {
    if (percentage <= LOW_HP_THRESHOLD * 100) return "low";
    if (percentage <= MEDIUM_HP_THRESHOLD * 100) return "medium";
    return "high";
  };

  const getHpColorClass = (percentage: number) => {
    const state = getHpState(percentage);
    if (state === "low") return "text-[#ef4444]";
    if (state === "medium") return "text-[#eab308]";
    return "text-[#22c55e]";
  };

  const hpIndicatorClass = (() => {
    const state = getHpState(hpPercentage);
    if (state === "low") return "bg-[#ef4444]";
    if (state === "medium") return "bg-[#eab308]";
    return "bg-[#22c55e]";
  })();

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/resized_cards/${getCardImageFilename(defenceCard)}`}
              alt={defenceCard.JpName}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="line-clamp-1 text-sm font-semibold">{defenceCard.JpName}</p>
              </TooltipTrigger>
              <TooltipContent side="top">{defenceCard.JpName}</TooltipContent>
            </Tooltip>
            {defenceCard.isEvo && (
              <Badge variant="outline" className="mt-1 text-[10px]">
                EVO
              </Badge>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px]">
          {badgeText}
        </Badge>
      </CardHeader>

      {(defenceCard.cardType === "Troop" || defenceCard.cardType === "Building") &&
        initialHP > 0 && (
          <CardContent className="space-y-2 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>初期HP</span>
              <span className="text-sm font-medium text-foreground">{initialHP}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>受けたダメージ</span>
              <span className="text-sm font-semibold text-destructive">{totalDamage}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">残りHP</span>
              <span className={cn("text-sm font-bold", getHpColorClass(hpPercentage))}>{remainingHP}</span>
            </div>
            {remainingHP <= 0 ? (
              <div className="flex items-center justify-center rounded-lg bg-destructive/20 py-2">
                <span className="animate-defeat text-sm font-bold text-destructive">💥 撃破！</span>
              </div>
            ) : (
              <Progress
                value={hpPercentage}
                indicatorClassName={hpIndicatorClass}
                className={cn(hpPercentage <= 20 && hpPercentage > 0 && "animate-hp-shake")}
              />
            )}
          </CardContent>
        )}

      <CardContent className="flex justify-end border-t px-4 py-3">
        <Button variant="outline" size="sm" onClick={onSelectClick}>
          変更
        </Button>
      </CardContent>
    </Card>
  );
};

const DefenceCard = memo(DefenceCardComponent);
DefenceCard.displayName = "DefenceCard";

export default DefenceCard;
