import {
  Box,
  Text,
  Badge,
  IconButton, // IconButton は削除ボタンで引き続き使用する可能性がありますが、Button もインポートします
  Button, // Button をインポート
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  VStack, // Use VStack for vertical layout
  HStack, // Use HStack for horizontal layout
  // Center, // Center removed as it's no longer used
  Tooltip, // Add Tooltip for damage key
  Image, // Import Image component
} from "@chakra-ui/react";
// import Image from 'next/image'; // Image import removed
import { memo } from "react"; // Import memo from react
import { DeleteIcon } from "@chakra-ui/icons"; // Keep DeleteIcon for error case, remove EditIcon
import { useCardContext } from "@/context/CardContext";
import { AttackCardState, AnyCard } from "@/types/CardTypes"; // Use new types
import {
  translateDamageType,
  DamageType,
  damageTypeTranslations, // Import translations object
} from "../types/damage-type-translations"; // Import translation utilities (Corrected path)

// Import helper functions from utils
import { parseDamage, getCardImageFilename } from "@/utils/cardUtils";

type AttackCardProps = {
  attackCard: AttackCardState;
  index: number;
  onEditClick: () => void; // 編集ボタンのクリックハンドラーを追加
  onRemove: () => void;
};

// Rename the original component
const AttackCardComponent = ({ attackCard, index, onEditClick, onRemove }: AttackCardProps) => { // onEditClick を追加
  // Removed onSelectClick
  const { findCardById, updateAttackCard, getDamageOptions } = useCardContext(); // Use findCardById, updateAttackCard, getDamageOptions
  // Find card data using cardId
  const cardData: AnyCard | undefined = findCardById(attackCard.cardId);

  // Handler for changing attack number for a specific damage type
  const handleAttackNumberChange = (
    damageKey: string,
    valueAsString: string,
    valueAsNumber: number,
  ) => {
    const newAttackNumber = isNaN(valueAsNumber) ? 0 : Math.max(0, valueAsNumber); // Allow 0 attacks
    const currentAttackNumbers = attackCard.attackNumbers || {};
    updateAttackCard(index, {
      ...attackCard,
      attackNumbers: {
        ...currentAttackNumbers,
        [damageKey]: newAttackNumber,
      },
    });
  };


  if (!cardData) {
    // Render a placeholder or error state if card data not found
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        width="100%"
        shadow="md"
        bg="red.50"
      >
        <Text color="red.700">
          エラー: カードデータが見つかりません (ID: {attackCard.cardId})
        </Text>
        <IconButton
          aria-label="カードを削除"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost" // Use ghost variant for less emphasis
          onClick={onRemove}
          size="sm"
          mt={2}
        />
      </Box>
    );
  }

  // Determine badge color and text
  let badgeColorScheme = "gray";
  let badgeText: string = cardData.cardType;
  if (cardData.cardType === "Troop") {
    badgeColorScheme = "green";
    badgeText = "ユニット";
  } else if (cardData.cardType === "Building") {
    badgeColorScheme = "orange";
    badgeText = "建物";
  } else if (cardData.cardType === "Spell") {
    badgeColorScheme = "purple";
    badgeText = "呪文";
  }

  // Get relevant damage options for this card, excluding DPS and non-translated types
  const damageOptions = getDamageOptions(attackCard.cardId).filter(
    (option) =>
      !option.key.toLowerCase().includes("dps") &&
      !option.key.toLowerCase().includes("damage_per_second") &&
      damageTypeTranslations.hasOwnProperty(option.key), // Check if key exists in translations
  );

  return (
    <Box // Opening Box tag
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="100%"
      shadow="sm" // Reduced shadow
      bg="white"
    >
      <VStack spacing={2} align="stretch">
        {" "}
        {/* Opening VStack tag */}
        {/* Header */}
        <HStack
          justify="space-between"
          align="center"
          p={2}
          borderBottomWidth="1px"
          borderBottomColor="gray.200"
        >
          <HStack spacing={2} flex={1} minWidth={0}>
            {" "}
            {/* Allow shrinking */}
            {/* Image */}
            <Image
              src={`/resized_cards/${getCardImageFilename(cardData)}`}
              alt={cardData.JpName}
              boxSize="30px" // Match previous placeholder size
              objectFit="contain"
              flexShrink={0}
            />
            {/* Removed Center */}
            <Tooltip
              label={cardData.JpName}
              placement="top-start"
              openDelay={500}
            >
              <Text fontSize="sm" fontWeight="bold" noOfLines={1} isTruncated>
                {cardData.JpName}
              </Text>
            </Tooltip>
            {cardData.isEvo && (
              <Badge colorScheme="purple" fontSize="2xs" ml={1}>
                EVO
              </Badge>
            )}
          </HStack>
          <Badge
            colorScheme={badgeColorScheme}
            fontSize="xs"
            ml={1}
            flexShrink={0}
          >
            {badgeText}
          </Badge>
        </HStack>
        {/* Damage and Attack Number Inputs (Vertical Layout) */}
        <VStack px={3} py={1} spacing={2} align="stretch"> {/* Increased spacing */}
          {damageOptions.length > 0 ? (
            damageOptions.map((option) => {
              const damageKey = option.key;
              const damageValue = parseDamage(option.value); // Use parseDamage here
              const currentAttackNumber = attackCard.attackNumbers?.[damageKey] || 0; // Default to 0 if not set

              return (
                <HStack key={damageKey} justify="space-between" align="center">
                  <Tooltip
                    label={`${translateDamageType(
                      damageKey as DamageType,
                    )}: ${damageValue}`}
                    placement="top-start"
                    openDelay={300}
                  >
                    <Text fontSize="xs" color="gray.600" noOfLines={1} isTruncated>
                      {translateDamageType(damageKey as DamageType)}:{" "}
                      <Text as="span" fontWeight="bold" color="gray.800">
                        {damageValue}
                      </Text>
                    </Text>
                  </Tooltip>
                  <HStack spacing={1} align="center">
                    <Text fontSize="xs" color="gray.500" mx={1}> {/* Added margin */}
                      x
                    </Text>
                    <NumberInput
                      value={currentAttackNumber}
                      min={0} // Allow 0 attacks
                      max={100} // Set a reasonable max
                      onChange={(valueAsString, valueAsNumber) =>
                        handleAttackNumberChange(
                          damageKey,
                          valueAsString,
                          valueAsNumber,
                        )
                      }
                      size="xs"
                      maxW="70px" // Slightly smaller width
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper fontSize="8px" /> {/* Smaller icons */}
                        <NumberDecrementStepper fontSize="8px" /> {/* Smaller icons */}
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </HStack>
              );
            })
          ) : (
            <Text fontSize="xs" color="gray.500" textAlign="center" py={2}>
              利用可能なダメージ情報がありません。
            </Text>
          )}
        </VStack>
        {/* Actions */}
        <Flex
          p={2}
          borderTopWidth="1px"
          borderTopColor="gray.200"
          justify="flex-end"
        >
          {" "}
          {/* Opening Flex tag */}
          <Button
            colorScheme="blue"
            variant="outline" // Changed from ghost
            onClick={onEditClick}
            size="sm"
            mr={2}
          >
            編集
          </Button>
          <Button
            colorScheme="red"
            variant="outline" // Changed from ghost
            onClick={onRemove}
            size="sm"
          >
            削除
          </Button>
        </Flex>{" "}
        {/* Closing Flex tag */}
      </VStack>{" "}
      {/* Closing VStack tag */}
    </Box>
  ); // Closing parenthesis for return
}; // Closing brace for component function

// Wrap the component with memo
const AttackCard = memo(AttackCardComponent);

// Set display name for easier debugging
AttackCard.displayName = "AttackCard";

export default AttackCard;
