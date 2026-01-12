"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">攻撃カード</CardTitle>
          <CardDescription className="text-xs">
            追加した攻撃カードの「回数」を入れると合計ダメージを計算します。
          </CardDescription>
        </div>
        <Button size="sm" onClick={handleAddCardClick}>
          <Plus className="mr-2 h-4 w-4" />
          追加
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {attackCards.length > 0 ? (
          <div>
            {attackCards.map((card, index) => (
              <div key={`${card.cardId}-${index}`}>
                {index > 0 && <hr className="border-border" />}
                <AttackCard
                  attackCard={card}
                  index={index}
                  onEditClick={() => handleEditCard(index)}
                  onRemove={() => removeAttackCard(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 p-3">
            <p className="text-sm font-medium">攻撃カードがまだありません</p>
            <p className="mt-1 text-xs text-muted-foreground">
              「追加」から攻撃カードを選んで、回数を入力してください。
            </p>
            <div className="mt-3">
              <Button size="sm" onClick={handleAddCardClick}>
                <Plus className="mr-2 h-4 w-4" />
                攻撃カードを追加
              </Button>
            </div>
          </div>
        )}

        {isSelectingCard && (
          <SelectCardOverlay
            isOpen={isSelectingCard}
            onClose={handleCancel}
            modalTitle="攻撃カードを選択"
            selectionMode="attack"
            cardFilter={(card) => card.attack === true}
            allowedCardTypes={["Troop", "Building", "Spell"]}
            onConfirm={(selected) => handleSelectCard(selected as AttackCardState)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AttackCardSection;
