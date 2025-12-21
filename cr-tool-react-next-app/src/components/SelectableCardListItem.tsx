import { memo, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnyCard } from "@/types/CardTypes";

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
      <li
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => onSelect(card)}
        onKeyDown={(e: KeyboardEvent<HTMLLIElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(card);
          }
        }}
        className={cn(
          "group rounded-lg border bg-card p-3 text-left transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isSelected
            ? "border-primary/50 ring-2 ring-primary/20"
            : "border-border hover:border-primary/30 hover:bg-muted/40",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold">{card.JpName}</p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {card.EnName}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {statsToDisplay.slice(0, 3).map((statText, index) => (
              <span key={index}>{statText}</span>
            ))}
          </div>
        )}
      </li>
    );
  },
);

SelectableCardListItem.displayName = "SelectableCardListItem";

export default SelectableCardListItem;
