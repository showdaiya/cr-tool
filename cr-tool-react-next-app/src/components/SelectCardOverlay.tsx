"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SelectableCardListItem from "./SelectableCardListItem";
import { useCardContext } from "@/context/CardContext";
import { AnyCard, AttackCardState } from "@/types/CardTypes";
import { getStatValue } from "@/utils/cardUtils";
import { OVERLAY_LIST_RENDER_DELAY_MS } from "@/constants";
import { cn } from "@/lib/utils";

type SortKey =
  | "id"
  | "JpName"
  | "EnName"
  | "ElixirCost"
  | "hitpoints"
  | "damage"
  | "area_damage"
  | "ranged_damage";
type SortOrder = "asc" | "desc";
type CardTypeFilter = AnyCard["cardType"];

type SelectCardOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  selectionMode: "attack" | "defence";
  cardFilter: (card: AnyCard) => boolean;
  allowedCardTypes: CardTypeFilter[];
  onConfirm: (selected: AnyCard | AttackCardState) => void;
  initialSelectedCard?: AnyCard | null;
};

const SelectCardOverlay = ({
  isOpen,
  onClose,
  modalTitle,
  selectionMode,
  cardFilter,
  allowedCardTypes,
  onConfirm,
  initialSelectedCard = null,
}: SelectCardOverlayProps) => {
  const { allCards } = useCardContext();
  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(initialSelectedCard);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showEvo, setShowEvo] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const [currentTab, setCurrentTab] = useState<CardTypeFilter | "All">("All");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsListReady(false);
      timer = setTimeout(() => setIsListReady(true), OVERLAY_LIST_RENDER_DELAY_MS);
    } else {
      setIsListReady(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const resetLocalState = useCallback(() => {
    setSelectedCard(initialSelectedCard);
    setSearchQuery("");
    setSortKey("id");
    setSortOrder("asc");
    setShowEvo(false);
    setCurrentTab("All");
  }, [initialSelectedCard]);

  useEffect(() => {
    if (!isOpen) resetLocalState();
  }, [isOpen, resetLocalState]);

  useEffect(() => {
    setSelectedCard(initialSelectedCard);
  }, [initialSelectedCard]);

  const handleSelectCard = useCallback((card: AnyCard) => {
    setSelectedCard(card);
  }, []);

  const handleConfirmClick = () => {
    if (!selectedCard) return;

    if (selectionMode === "attack") {
      const attackState: AttackCardState = { cardId: selectedCard.id, attackNumbers: {} };
      onConfirm(attackState);
    } else {
      onConfirm(selectedCard);
    }
    onClose();
  };

  const sortCards = useCallback(
    (cards: AnyCard[], key: SortKey, order: SortOrder): AnyCard[] => {
      return [...cards].sort((a, b) => {
        let valA: number | string;
        let valB: number | string;

        if (key === "JpName") {
          valA = a.JpName;
          valB = b.JpName;
        } else if (key === "EnName") {
          valA = a.EnName;
          valB = b.EnName;
        } else if (key === "id") {
          valA = a.id;
          valB = b.id;
        } else if (key === "ElixirCost") {
          valA = a.ElixirCost;
          valB = b.ElixirCost;
        } else {
          valA = getStatValue(a, key);
          valB = getStatValue(b, key);
          if (isNaN(valA)) valA = order === "asc" ? Infinity : -Infinity;
          if (isNaN(valB)) valB = order === "asc" ? Infinity : -Infinity;
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return order === "asc" ? valA.localeCompare(valB, "ja") : valB.localeCompare(valA, "ja");
        } else if (typeof valA === "number" && typeof valB === "number") {
          return order === "asc" ? valA - valB : valB - valA;
        }
        return 0;
      });
    },
    [],
  );

  const getFilteredAndSortedCards = useCallback(
    (targetType: CardTypeFilter | "All") => {
      const query = searchQuery.trim().toLowerCase();
      const filtered = allCards.filter(
        (card) =>
          cardFilter(card) &&
          (targetType === "All" || card.cardType === targetType) &&
          (showEvo ? card.isEvo : !card.isEvo) &&
          (card.JpName.toLowerCase().includes(query) ||
            card.EnName.toLowerCase().includes(query) ||
            String(card.id).includes(query)),
      );

      let applicableSortKey = sortKey;
      if (targetType === "Spell" && sortKey === "hitpoints") {
        applicableSortKey = "JpName";
      }

      return sortCards(filtered, applicableSortKey, sortOrder);
    },
    [allCards, cardFilter, showEvo, searchQuery, sortKey, sortOrder, sortCards],
  );

  const showTabs = allowedCardTypes.length > 1;
  const cardsToDisplay = useMemo(() => getFilteredAndSortedCards(currentTab), [getFilteredAndSortedCards, currentTab]);

  const handleTabChange = (value: string) => {
    if (value === "All" || allowedCardTypes.includes(value as CardTypeFilter)) {
      setCurrentTab(value as CardTypeFilter | "All");
    }
  };

  const getCardTypeLabel = (type: CardTypeFilter | "All") => {
    if (type === "All") return "すべて";
    if (type === "Troop") return "ユニット";
    if (type === "Building") return "建物";
    return "呪文";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-4 py-3">
          <DialogTitle className="text-base">{modalTitle}</DialogTitle>
          <DialogDescription className="text-xs">検索してカードを選択してください。</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-3">
          <div className="sticky top-0 z-10 space-y-2 bg-card/90 pb-2 backdrop-blur">
            <Input
              placeholder="カード名 / IDで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-full px-3 text-sm"
            />

            {/* コンパクトなフィルタ行 */}
            <div className="flex items-center gap-1.5">
              {/* カード種別フィルタ（ドロップダウン） */}
              {showTabs && (
                <select
                  value={currentTab}
                  onChange={(e) => handleTabChange(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  aria-label="カード種別"
                >
                  <option value="All">すべて</option>
                  {allowedCardTypes.map((type) => (
                    <option key={type} value={type}>
                      {getCardTypeLabel(type)}
                    </option>
                  ))}
                </select>
              )}

              {/* 並び替えドロップダウン */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="h-8 flex-1 min-w-0 rounded-md border border-input bg-background px-2 text-xs"
                aria-label="並び替え"
              >
                <option value="id">ID</option>
                <option value="JpName">日本語名</option>
                <option value="EnName">英語名</option>
                <option value="ElixirCost">コスト</option>
                <option value="hitpoints">HP</option>
                <option value="damage">単体</option>
                <option value="area_damage">範囲</option>
                <option value="ranged_damage">遠距離</option>
              </select>

              {/* 昇順/降順ボタン */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                aria-label={sortOrder === "asc" ? "降順に変更" : "昇順に変更"}
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>

              {/* 進化切り替えボタン */}
              <Button
                variant={showEvo ? "secondary" : "ghost"}
                size="sm"
                className="h-8 shrink-0 px-2 text-xs"
                onClick={() => setShowEvo(!showEvo)}
              >
                {showEvo ? "進化" : "通常"}
              </Button>
            </div>
          </div>

          {/* カードリスト */}
          {isListReady ? (
            <div className="overflow-y-auto rounded-lg border bg-background p-2">
              <div className="grid grid-cols-1 gap-2">
                {cardsToDisplay.map((card) => (
                  <SelectableCardListItem
                    key={`${card.id}-${card.EnName}-${card.isEvo}`}
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                    onSelect={handleSelectCard}
                  />
                ))}
              </div>
              {cardsToDisplay.length === 0 && (
                <div className="py-4 text-center text-xs text-muted-foreground">該当するカードがありません。</div>
              )}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">Loading...</div>
          )}
        </div>

        <DialogFooter className={cn("shrink-0 border-t px-4 py-2")}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            キャンセル
          </Button>
          <Button size="sm" className="ml-2" onClick={handleConfirmClick} disabled={!selectedCard}>
            選択
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCardOverlay;
