import { memo } from "react";
import {
  ListItem,
  VStack,
  HStack,
  Text,
  Badge,
  // BoxProps, // No longer needed
} from "@chakra-ui/react";
import { AnyCard } from "@/types/CardTypes";

// Define specific props instead of extending BoxProps to avoid type conflicts
type SelectableCardListItemProps = {
  card: AnyCard;
  isSelected: boolean;
  onSelect: (card: AnyCard) => void;
};

/**
 * カード選択オーバーレイ内で使用される、メモ化されたリストアイテムコンポーネント。
 * カード情報を表示し、選択状態に応じてスタイルを変更する。
 */
const SelectableCardListItem = memo(
  ({ card, isSelected, onSelect }: SelectableCardListItemProps) => { // Removed ...rest
    // console.log(`Rendering SelectableCardListItem: ${card.JpName}`); // Debugging

    // Determine which stats to display based on card type (optional enhancement)
    const statsToDisplay = [];
    if (card.stats.hitpoints) {
      statsToDisplay.push(`HP: ${card.stats.hitpoints}`);
    }
    if (card.stats.damage) {
      statsToDisplay.push(`ダメージ: ${card.stats.damage}`);
    }
    if (card.stats.area_damage) {
      statsToDisplay.push(`範囲ダメ: ${card.stats.area_damage}`);
    }
    if (card.stats.ranged_damage) {
      statsToDisplay.push(`遠距離ダメ: ${card.stats.ranged_damage}`);
    }
    // Add more stats as needed

    return (
      <ListItem
        onClick={() => onSelect(card)}
        cursor="pointer"
        p={2}
        borderWidth="1px"
        borderRadius="md"
        bg={isSelected ? "blue.50" : "transparent"}
        borderColor={isSelected ? "blue.500" : "gray.200"}
        _hover={{ borderColor: "blue.300", bg: "gray.50" }}
        // Removed {...rest}
      >
        <VStack align="stretch" spacing={1} flex="1">
          {/* Card Name and Evo Badge */}
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="md" noOfLines={1}>
              {card.JpName}
            </Text>
            {card.isEvo && (
              <Badge colorScheme="purple" fontSize="xs">
                EVO
              </Badge>
            )}
          </HStack>
          {/* Elixir Cost and Key Stats */}
          <HStack justify="flex-end" spacing={3}>
            <Text fontSize="xs" minW="40px" textAlign="right">
              エリクサー: {card.ElixirCost}
            </Text>
            {/* Display a few key stats dynamically */}
            {statsToDisplay.slice(0, 2).map((statText, index) => (
              <Text key={index} fontSize="xs" minW="70px" textAlign="right">
                {statText}
              </Text>
            ))}
          </HStack>
        </VStack>
      </ListItem>
    );
  },
);

SelectableCardListItem.displayName = "SelectableCardListItem";

export default SelectableCardListItem;