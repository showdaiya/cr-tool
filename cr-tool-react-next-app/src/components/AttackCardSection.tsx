"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCardContext } from "@/context/CardContext";
import AttackCard from "@/components/AttackCard";
import SelectCardOverlay from "./SelectCardOverlay";
import { AttackCardState } from "@/types/CardTypes";

const AttackCardSection = () => {
  const { attackCards, addAttackCard, removeAttackCard, updateAttackCard } = useCardContext();
  const [isSelectingCard, setIsSelectingCard] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddCardClick = () => {
    setIsSelectingCard(true);
    setEditingIndex(null);
  };

  const handleEditCard = (index: number) => {
    setEditingIndex(index);
    setIsSelectingCard(true);
  };

  const handleSelectCard = (card: AttackCardState) => {
    if (editingIndex !== null) {
      updateAttackCard(editingIndex, card);
    } else {
      addAttackCard(card);
    }
    setIsSelectingCard(false);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setIsSelectingCard(false);
    setEditingIndex(null);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">攻撃カード</p>
        <Button size="sm" onClick={handleAddCardClick}>
          <Plus className="mr-2 h-4 w-4" />
          追加
        </Button>
      </div>

      {attackCards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1">
          {attackCards.map((card, index) => (
            <AttackCard
              key={`${card.cardId}-${index}`}
              attackCard={card}
              index={index}
              onEditClick={() => handleEditCard(index)}
              onRemove={() => removeAttackCard(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">攻撃カードを追加してください</p>
      )}

      {isSelectingCard && (
        <SelectCardOverlay
          isOpen={isSelectingCard}
          onClose={handleCancel}
          modalTitle="攻撃カードを選択"
          cardFilter={(card) => card.attack === true}
          allowedCardTypes={["Troop", "Building", "Spell"]}
          onConfirm={(selected) => {
            if ("cardId" in selected && "attackNumbers" in selected) {
              handleSelectCard(selected as AttackCardState);
            } else {
              console.error("Unexpected AnyCard received for attack selection.");
            }
          }}
        />
      )}
    </div>
  );
};

export default AttackCardSection;
