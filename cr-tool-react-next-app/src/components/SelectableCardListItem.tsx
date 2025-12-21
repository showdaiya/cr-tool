import { memo } from "react";
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

    return (
      <li
        onClick={() => onSelect(card)}
        className={cn(
          "cursor-pointer rounded-md border p-3 transition-colors",
          isSelected
            ? "border-primary/60 bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted",
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="line-clamp-1 text-sm font-semibold">{card.JpName}</p>
            {card.isEvo && (
              <Badge variant="secondary" className="text-[10px]">
                EVO
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-[11px] text-muted-foreground">
            <span className="min-w-[60px] text-right">エリクサー: {card.ElixirCost}</span>
            {statsToDisplay.slice(0, 2).map((statText, index) => (
              <span key={index} className="min-w-[90px] text-right">
                {statText}
              </span>
            ))}
          </div>
        </div>
      </li>
    );
  },
);

SelectableCardListItem.displayName = "SelectableCardListItem";

export default SelectableCardListItem;
