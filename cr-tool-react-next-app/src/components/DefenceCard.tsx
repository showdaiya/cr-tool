import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  // Center, // Center removed
  Progress,
  Image, // Import Image
  Tooltip, // Add Tooltip import
  Flex, // Add Flex import
} from "@chakra-ui/react";
import { memo } from "react"; // Import memo
// import Image from 'next/image'; // Image import removed
import { useCardContext } from "@/context/CardContext";
// import { AnyCard } from "@/types/CardTypes"; // Use AnyCard - No longer needed here
// Import helper functions from utils
import { getInitialHp, getCardImageFilename } from "@/utils/cardUtils";
import { LOW_HP_THRESHOLD } from "@/constants"; // Import constant

type DefenceCardProps = {
  onSelectClick: () => void;
};

// Rename the original component
const DefenceCardComponent = ({ onSelectClick }: DefenceCardProps) => {
  // Get memoized values directly from context
  const { defenceCard, totalDamage, remainingHP } = useCardContext();

  if (!defenceCard) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        width="100%"
        shadow="md"
        bg="gray.50"
        minHeight="150px" // Ensure minimum height
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button colorScheme="blue" onClick={onSelectClick} size="sm">
          防衛カードを選択
        </Button>
      </Box>
    );
  }

  const initialHP = getInitialHp(defenceCard); // Get initial HP using helper from utils
  const hpPercentage = initialHP > 0 ? (remainingHP / initialHP) * 100 : 0;

  // Determine badge color and text based on cardType
  let badgeColorScheme = "gray";
  // Explicitly type badgeText as string
  let badgeText: string = defenceCard.cardType;
  if (defenceCard.cardType === "Troop") {
    badgeColorScheme = "green";
    badgeText = "ユニット"; // Now assignable to string
  } else if (defenceCard.cardType === "Building") {
    badgeColorScheme = "orange";
    badgeText = "建物"; // Now assignable to string
  }
  // Spells shouldn't normally be defence cards, but handle just in case
  else if (defenceCard.cardType === "Spell") {
    badgeColorScheme = "purple";
    badgeText = "呪文"; // Now assignable to string
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      width="100%"
      shadow="sm" // Keep only one shadow prop, using 'sm' to match AttackCard
      bg="white"
      overflow="hidden" // Match overflow
    >
      <VStack spacing={0} align="stretch">
        {" "}
        {/* Main VStack, spacing 0 to control with padding */}
        {/* Header Section */}
        <HStack
          justify="space-between"
          align="center"
          p={2} // Match padding
          borderBottomWidth="1px" // Match border
          borderBottomColor="gray.200" // Match border color
        >
          <HStack spacing={2} flex={1} minWidth={0}>
            {" "}
            {/* Match structure */}
            {/* Image */}
            <Image
              src={`/resized_cards/${getCardImageFilename(defenceCard)}`}
              alt={defenceCard.JpName}
              boxSize="30px" // Match image size
              objectFit="contain"
              flexShrink={0}
            />
            {/* Name and Evo Badge */}
            <Tooltip
              label={defenceCard.JpName}
              placement="top-start"
              openDelay={500}
            >
              <Text fontSize="sm" fontWeight="bold" noOfLines={1} isTruncated>
                {" "}
                {/* Match text size */}
                {defenceCard.JpName}
              </Text>
            </Tooltip>
            {defenceCard.isEvo && (
              <Badge colorScheme="purple" fontSize="2xs" ml={1}>
                {" "}
                {/* Match font size */}
                EVO
              </Badge>
            )}
          </HStack>
          {/* Type Badge */}
          <Badge
            colorScheme={badgeColorScheme}
            fontSize="xs"
            ml={1}
            flexShrink={0}
          >
            {" "}
            {/* Match font size */}
            {badgeText}
          </Badge>
        </HStack>
        {/* HP/Damage Info Section */}
        {(defenceCard.cardType === "Troop" ||
          defenceCard.cardType === "Building") &&
          initialHP > 0 && (
            <VStack spacing={1} align="stretch" px={3} py={2}>
              {" "}
              {/* Match padding */}
              <HStack justifyContent="space-between" width="100%">
                <Text fontSize="xs" color="gray.600">
                  {" "}
                  {/* Match text size */}
                  初期HP:
                </Text>
                <Text fontSize="sm">{initialHP}</Text> {/* Match text size */}
              </HStack>
              <HStack justifyContent="space-between" width="100%">
                <Text fontSize="xs" color="gray.600">
                  {" "}
                  {/* Match text size */}
                  受けたダメージ:
                </Text>
                <Text
                  fontSize="sm" // Match text size
                  color={totalDamage > 0 ? "red.500" : "gray.500"}
                >
                  {totalDamage}
                </Text>
              </HStack>
              <HStack
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              >
                <Text fontSize="xs" fontWeight="medium" color="gray.600">
                  {" "}
                  {/* Match text size */}
                  残りHP:
                </Text>
                <Text
                  fontSize="sm" // Match text size
                  fontWeight="bold"
                  color={
                    remainingHP <= initialHP * LOW_HP_THRESHOLD ? "red.500" : "green.500"
                  }
                >
                  {remainingHP}
                </Text>
              </HStack>
              <Progress
                value={hpPercentage}
                size="xs" // Match size
                colorScheme={
                  hpPercentage <= 30
                    ? "red"
                    : hpPercentage <= 60
                      ? "yellow"
                      : "green"
                }
                borderRadius="md"
                mt={1} // Add small margin top
              />
            </VStack>
          )}
        {/* Action Button Section */}
        <Flex
          p={2} // Match padding
          borderTopWidth="1px" // Match border
          borderTopColor="gray.200" // Match border color
          justify="flex-end" // Align button to the right
        >
          <Button
            colorScheme="blue" // Changed color scheme to blue for consistency? Or keep gray? Let's keep gray for 'Change'
            variant="outline"
            onClick={onSelectClick}
            size="sm" // Match size
          >
            変更
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

// Wrap the component with memo
const DefenceCard = memo(DefenceCardComponent);

// Set display name for easier debugging
DefenceCard.displayName = "DefenceCard";

export default DefenceCard;
