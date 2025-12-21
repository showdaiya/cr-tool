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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  cardFilter: (card: AnyCard) => boolean;
  allowedCardTypes: CardTypeFilter[];
  onConfirm: (selected: AnyCard | AttackCardState) => void;
  initialSelectedCard?: AnyCard | null;
};

const SelectCardOverlay = ({
  isOpen,
  onClose,
  modalTitle,
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
  const [currentTab, setCurrentTab] = useState<CardTypeFilter | "All">(
    allowedCardTypes.length > 1 ? allowedCardTypes[0] : "All",
  );

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
    setCurrentTab(allowedCardTypes.length > 1 ? allowedCardTypes[0] : "All");
  }, [initialSelectedCard, allowedCardTypes]);

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
    if (selectedCard) {
      if (modalTitle === "攻撃カードを選択") {
        const attackState: AttackCardState = { cardId: selectedCard.id, attackNumbers: {} };
        onConfirm(attackState);
      } else {
        onConfirm(selectedCard);
      }
      onClose();
    }
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
      const filtered = allCards.filter(
        (card) =>
          cardFilter(card) &&
          (targetType === "All" || card.cardType === targetType) &&
          (showEvo ? card.isEvo : !card.isEvo) &&
          (card.JpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.EnName.toLowerCase().includes(searchQuery.toLowerCase())),
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-6 py-4">
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>検索してカードを選択してください。</DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-4">
          <Input
            placeholder="カード名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="id">ID</option>
              <option value="JpName">日本語名</option>
              <option value="EnName">英語名</option>
              <option value="ElixirCost">エリクサーコスト</option>
              <option value="hitpoints">HP</option>
              <option value="damage">ダメージ(単体)</option>
              <option value="area_damage">ダメージ(範囲)</option>
              <option value="ranged_damage">ダメージ(遠距離)</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ArrowUp className="mr-2 h-4 w-4" /> : <ArrowDown className="mr-2 h-4 w-4" />}
              並び替え
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowEvo(!showEvo)}>
              {showEvo ? "通常表示" : "進化表示"}
            </Button>
          </div>

          {showTabs ? (
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full justify-start">
                {allowedCardTypes.map((type) => (
                  <TabsTrigger key={type} value={type} className="capitalize">
                    {type === "Troop" ? "ユニット" : type === "Building" ? "建物" : "呪文"}
                  </TabsTrigger>
                ))}
              </TabsList>
              {allowedCardTypes.map((type) => (
                <TabsContent key={type} value={type} className="mt-3">
                  {isListReady ? (
                    <div className="overflow-y-auto rounded-md border bg-background">
                      <ul className="divide-y">
                        {getFilteredAndSortedCards(type).map((card) => (
                          <SelectableCardListItem
                            key={`${card.id}-${card.EnName}-${card.isEvo}`}
                            card={card}
                            isSelected={selectedCard?.id === card.id}
                            onSelect={handleSelectCard}
                          />
                        ))}
                        {getFilteredAndSortedCards(type).length === 0 && (
                          <li className="py-6 text-center text-sm text-muted-foreground">該当なし</li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">Loading...</div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : isListReady ? (
            <div className="overflow-y-auto rounded-md border bg-background">
              <ul className="divide-y">
                {cardsToDisplay.map((card) => (
                  <SelectableCardListItem
                    key={`${card.id}-${card.EnName}-${card.isEvo}`}
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                    onSelect={handleSelectCard}
                  />
                ))}
                {cardsToDisplay.length === 0 && (
                  <li className="py-6 text-center text-sm text-muted-foreground">該当するカードがありません。</li>
                )}
              </ul>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">Loading...</div>
          )}
        </div>

        <DialogFooter className={cn("shrink-0 border-t px-6 py-3")}>
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button className="ml-2" onClick={handleConfirmClick} disabled={!selectedCard}>
            選択
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCardOverlay;
