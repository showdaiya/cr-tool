"use client";

import { memo, ChangeEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCardContext } from "@/context/CardContext";
import { AttackCardState, AnyCard } from "@/types/CardTypes";
import {
  translateDamageType,
  DamageType,
  damageTypeTranslations,
} from "../types/damage-type-translations";
import { parseDamage, getCardImageFilename } from "@/utils/cardUtils";
import { cn } from "@/lib/utils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type AttackCardProps = {
  attackCard: AttackCardState;
  index: number;
  onEditClick: () => void;
  onRemove: () => void;
};

const AttackCardComponent = ({
  attackCard,
  index,
  onEditClick,
  onRemove,
}: AttackCardProps) => {
  const { findCardById, updateAttackCard, getDamageOptions } = useCardContext();
  const cardData: AnyCard | undefined = findCardById(attackCard.cardId);

  const setAttackCount = (damageKey: string, nextCount: number) => {
    const safeCount = Math.min(100, Math.max(0, nextCount));
    const currentAttackNumbers = attackCard.attackNumbers || {};
    updateAttackCard(index, {
      ...attackCard,
      attackNumbers: {
        ...currentAttackNumbers,
        [damageKey]: safeCount,
      },
    });
  };

  const handleAttackNumberChange = (damageKey: string, e: ChangeEvent<HTMLInputElement>) => {
    const valueAsNumber = parseInt(e.target.value, 10);
    const nextCount = isNaN(valueAsNumber) ? 0 : valueAsNumber;
    setAttackCount(damageKey, nextCount);
  };

  if (!cardData) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="py-4 text-sm text-destructive">
          カードデータが見つかりません (ID: {attackCard.cardId})
        </CardContent>
        <CardContent className="flex justify-end pt-0 pb-4">
          <Button variant="destructive" size="sm" onClick={onRemove}>
            削除
          </Button>
        </CardContent>
      </Card>
    );
  }

  const badgeText =
    cardData.cardType === "Troop"
      ? "ユニット"
      : cardData.cardType === "Building"
        ? "建物"
        : "呪文";

  const damageOptions = getDamageOptions(attackCard.cardId).filter(
    (option) =>
      !option.key.toLowerCase().includes("dps") &&
      !option.key.toLowerCase().includes("damage_per_second") &&
      damageTypeTranslations.hasOwnProperty(option.key),
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 border-b px-3 py-2">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/resized_cards/${getCardImageFilename(cardData)}`}
            alt={cardData.JpName}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="line-clamp-1 text-sm">{cardData.JpName}</CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4 font-normal">
              {badgeText}
            </Badge>
          </div>
          {cardData.isEvo && (
            <Badge variant="outline" className="w-fit text-[9px] px-1 h-3.5">
              EVO
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onEditClick}>
            編集
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:text-destructive" onClick={onRemove}>
            削除
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-1">
        {damageOptions.length > 0 ? (
          <div className="divide-y">
            {damageOptions.map((option) => {
              const damageKey = option.key;
              const damageValue = parseDamage(option.value);
              const currentAttackNumber = attackCard.attackNumbers?.[damageKey] ?? 0;
              const subtotal = damageValue * currentAttackNumber;

              return (
                <div key={damageKey} className="flex items-center justify-between gap-2 py-2">
                  <div className="min-w-0 flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="truncate text-xs font-medium">
                          {translateDamageType(damageKey as DamageType)}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {translateDamageType(damageKey as DamageType)}
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-[10px] text-muted-foreground">
                      ダメージ: <span className="font-medium text-foreground">{damageValue}</span>
                      {currentAttackNumber > 0 && (
                        <span className="ml-2">→ 小計: <span className="font-semibold text-foreground">{subtotal}</span></span>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => setAttackCount(damageKey, currentAttackNumber - 1)}
                      disabled={currentAttackNumber <= 0}
                      aria-label="回数を減らす"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      inputMode="numeric"
                      placeholder="0"
                      value={currentAttackNumber === 0 ? "" : String(currentAttackNumber)}
                      onChange={(e) => handleAttackNumberChange(damageKey, e)}
                      className={cn(
                        "h-7 w-10 rounded-md border text-center text-xs tabular-nums px-0",
                        currentAttackNumber === 0 && "text-muted-foreground",
                      )}
                      aria-label="回数"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => setAttackCount(damageKey, currentAttackNumber + 1)}
                      disabled={currentAttackNumber >= 100}
                      aria-label="回数を増やす"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-2 text-center text-xs text-muted-foreground">
            利用可能なダメージ情報がありません。
          </p>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-dashed pt-2 pb-1 text-xs text-muted-foreground">
          <span className="font-medium">合計</span>
          <span className="text-sm font-bold tabular-nums text-foreground">
            {damageOptions.reduce((sum, option) => {
              const damageKey = option.key;
              const damageValue = parseDamage(option.value);
              const count = attackCard.attackNumbers?.[damageKey] ?? 0;
              return sum + damageValue * count;
            }, 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const AttackCard = memo(AttackCardComponent);
AttackCard.displayName = "AttackCard";

export default AttackCard;
