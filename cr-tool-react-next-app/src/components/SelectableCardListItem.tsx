import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnyCard } from "@/types/CardTypes";
import { getCardImageFilename } from "@/utils/cardUtils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type SelectableCardListItemProps = {
  card: AnyCard;
  isSelected: boolean;
  onSelect: (card: AnyCard) => void;
};

const SelectableCardListItem = memo(
  ({ card, isSelected, onSelect }: SelectableCardListItemProps) => {
    const statsToDisplay: string[] = [];
    if (card.stats.hitpoints) statsToDisplay.push(`HP: ${card.stats.hitpoints}`);
    if (card.stats.damage) statsToDisplay.push(`ダメージ: ${card.stats.damage}`);
    if (card.stats.area_damage) statsToDisplay.push(`範囲ダメ: ${card.stats.area_damage}`);
    if (card.stats.ranged_damage) statsToDisplay.push(`遠距離ダメ: ${card.stats.ranged_damage}`);

    const typeLabel =
      card.cardType === "Troop"
        ? "ユニット"
        : card.cardType === "Building"
          ? "建物"
          : "呪文";

    return (
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(card)}
        className={cn(
          "group w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "active:scale-[0.98]",
          isSelected
            ? "border-primary/50 ring-2 ring-primary/20 animate-card-select"
            : "border-border hover:border-primary/30 hover:bg-muted/40",
        )}
      >
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <div className="flex items-center justify-center rounded-lg bg-muted/50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/resized_cards/${getCardImageFilename(card)}`}
              alt={card.JpName}
              className="h-20 w-20 rounded-md object-contain shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-semibold">{card.JpName}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                  {card.EnName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {typeLabel}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {card.ElixirCost}
                </Badge>
                {card.isEvo && (
                  <Badge variant="secondary" className="text-[10px]">
                    EVO
                  </Badge>
                )}
              </div>
            </div>

            {statsToDisplay.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {statsToDisplay.slice(0, 3).map((statText, index) => (
                  <span key={index}>{statText}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  },
);

SelectableCardListItem.displayName = "SelectableCardListItem";

export default SelectableCardListItem;
