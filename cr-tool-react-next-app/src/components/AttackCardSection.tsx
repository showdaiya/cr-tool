import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useCardContext } from "@/context/CardContext";
import AttackCard from "@/components/AttackCard";
import SelectCardOverlay from "./SelectCardOverlay"; // Import the unified overlay
import { AttackCardState } from "@/types/CardTypes";

const AttackCardSection = () => {
  // updateAttackCard を context から取得
  const { attackCards, addAttackCard, removeAttackCard, updateAttackCard } = useCardContext();
  const [isSelectingCard, setIsSelectingCard] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // editingIndex state を復元

  const handleAddCardClick = () => {
    setIsSelectingCard(true);
    // setEditingIndex(null); // No longer needed
  };

  // handleEditCard 関数を復元・実装
  const handleEditCard = (index: number) => {
    setEditingIndex(index); // 編集中のカードのインデックスを設定
    setIsSelectingCard(true); // 選択オーバーレイを開く
  };

  const handleSelectCard = (card: AttackCardState) => {
    // editingIndex の値に基づいて追加または更新を行う
    if (editingIndex !== null) {
      updateAttackCard(editingIndex, card); // 既存のカードを更新
    } else {
      addAttackCard(card); // 新しいカードを追加
    }
    setIsSelectingCard(false); // オーバーレイを閉じる
    setEditingIndex(null); // 編集インデックスをリセット
  };

  const handleCancel = () => {
    setIsSelectingCard(false);
    // setEditingIndex(null); // No longer needed
  };

  return (
    <Box width="100%">
      <VStack spacing={4} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="bold">
            攻撃カード
          </Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            onClick={handleAddCardClick} // Use updated handler name
            size="sm"
          >
            追加
          </Button>
        </Flex>

        {attackCards.length > 0 ? (
          <Grid templateColumns="repeat(1, 1fr)" gap={4} width="100%">
            {attackCards.map((card, index) => (
              <GridItem key={`${card.cardId}-${index}`} width="100%">
                {" "}
                {/* Use a more stable key */}
                <AttackCard
                  attackCard={card}
                  index={index}
                  onEditClick={() => handleEditCard(index)} // onEditClick プロパティを追加し、handleEditCard を接続
                  onRemove={() => removeAttackCard(index)}
                />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text color="gray.500">攻撃カードを追加してください</Text>
        )}
      </VStack>

      {isSelectingCard && (
        <SelectCardOverlay
          isOpen={isSelectingCard}
          onClose={handleCancel}
          modalTitle="攻撃カードを選択"
          cardFilter={(card) => card.attack === true} // Filter for attack cards
          allowedCardTypes={["Troop", "Building", "Spell"]} // All types allowed for attack
          onConfirm={(selected) => {
            // Type guard to ensure selected is AttackCardState
            if ('cardId' in selected && 'attackNumbers' in selected) {
              handleSelectCard(selected as AttackCardState); // Cast is safe here
            } else {
              console.error("Unexpected AnyCard received for attack selection.");
            }
          }}
          // No initialSelectedCard needed for attack overlay
        />
      )}
    </Box>
  );
};

export default AttackCardSection;
