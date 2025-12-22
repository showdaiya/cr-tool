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
  CardDescription,
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
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/resized_cards/${getCardImageFilename(cardData)}`}
            alt={cardData.JpName}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <CardTitle className="line-clamp-1 text-sm">{cardData.JpName}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-[11px]">
            <Badge variant="secondary" className="text-[10px]">
              {badgeText}
            </Badge>
            {cardData.isEvo && (
              <Badge variant="outline" className="text-[10px]">
                EVO
              </Badge>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px]">
            ID: {cardData.id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {damageOptions.length > 0 ? (
          <div className="space-y-3">
            {damageOptions.map((option) => {
              const damageKey = option.key;
              const damageValue = parseDamage(option.value);
              const currentAttackNumber = attackCard.attackNumbers?.[damageKey] ?? 0;
              const subtotal = damageValue * currentAttackNumber;

              return (
                <div key={damageKey} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="line-clamp-2 text-sm font-medium">
                            {translateDamageType(damageKey as DamageType)}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {translateDamageType(damageKey as DamageType)}
                        </TooltipContent>
                      </Tooltip>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        1回あたり <span className="font-semibold text-foreground">{damageValue}</span>
                      </p>
                    </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-full"
                      onClick={() => setAttackCount(damageKey, currentAttackNumber - 1)}
                      disabled={currentAttackNumber <= 0}
                      aria-label="回数を減らす"
                    >
                      <Minus className="h-5 w-5" />
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
                          "h-11 w-20 rounded-full border-2 text-right text-sm tabular-nums",
                          currentAttackNumber === 0 && "text-muted-foreground",
                        )}
                      aria-label="回数"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-full"
                      onClick={() => setAttackCount(damageKey, currentAttackNumber + 1)}
                      disabled={currentAttackNumber >= 100}
                      aria-label="回数を増やす"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-md bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
                    <span>小計</span>
                    <span className="font-bold tabular-nums text-foreground">{subtotal}</span>
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

        <div className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">このカードの合計</span>
            <span className="text-sm font-bold tabular-nums text-accent-foreground">
              {damageOptions.reduce((sum, option) => {
                const damageKey = option.key;
                const damageValue = parseDamage(option.value);
                const count = attackCard.attackNumbers?.[damageKey] ?? 0;
                return sum + damageValue * count;
              }, 0)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onEditClick}>
            編集
          </Button>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            削除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AttackCard = memo(AttackCardComponent);
AttackCard.displayName = "AttackCard";

export default AttackCard;
