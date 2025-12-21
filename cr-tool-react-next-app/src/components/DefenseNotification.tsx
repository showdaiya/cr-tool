import { Box, Flex, Text, HStack, Icon, Button } from "@chakra-ui/react";
import React, { KeyboardEvent, MouseEvent } from "react"; // Import event types
import { useCardContext } from "@/context/CardContext";
import { ChevronDownIcon } from "@chakra-ui/icons";
// import { AnyCard } from "@/types/CardTypes"; // Import AnyCard - No longer needed
import { Badge } from "@chakra-ui/react";
// Import helper functions from utils
import { LOW_HP_THRESHOLD } from "@/constants"; // Import constant
import { getInitialHp } from "@/utils/cardUtils";

type DefenseNotificationProps = {
  onSelectDefenseCard?: () => void;
};

const DefenseNotification = ({
  onSelectDefenseCard,
}: DefenseNotificationProps) => {
  // Get memoized values directly from context
  const { defenceCard, totalDamage, remainingHP } = useCardContext();

  const scrollToDefenseCard = () => {
    const defenseCardSection = document.getElementById("defense-card-section");
    if (defenseCardSection) {
      defenseCardSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 防衛カードが選択されていない場合
  if (!defenceCard) {
    return (
      <Box
        as="button" // Use button semantics for accessibility
        role="button" // Explicitly set role
        tabIndex={0} // Make it focusable
        position="fixed"
        top="12px"
        left="50%"
        transform="translateX(-50%)"
        width="90%"
        maxWidth="300px"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        p={2}
        zIndex={1000}
        borderWidth="1px"
        borderColor="gray.200"
        opacity={0.95}
        cursor="pointer"
        onClick={scrollToDefenseCard}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // Prevent default space bar scroll
            scrollToDefenseCard();
          }
        }}
        transition="all 0.2s"
        _hover={{
          transform: "translateX(-50%) translateY(2px)",
          boxShadow: "md",
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="sm" color="gray.600">
            防衛カードが選択されていません
          </Text>
          {onSelectDefenseCard && (
            <Button
              size="xs"
              colorScheme="blue"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onSelectDefenseCard();
              }}
            >
              選択
            </Button>
          )}
        </Flex>
      </Box>
    );
  }

  // 防衛カードが選択されている場合
  const initialHP = getInitialHp(defenceCard); // Get initial HP from utils

  // Determine color based on remaining HP percentage
  const hpPercentage = initialHP > 0 ? (remainingHP / initialHP) * 100 : 0;
  const hpColor = hpPercentage <= LOW_HP_THRESHOLD * 100 ? "red.500" : "green.500";

  return (
    <Box
      as="button" // Use button semantics for accessibility
      role="button" // Explicitly set role
      tabIndex={0} // Make it focusable
      position="fixed"
      top="12px"
      left="50%"
      transform="translateX(-50%)"
      width="90%"
      maxWidth="300px"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={2}
      zIndex={1000}
      borderWidth="1px"
      borderColor="gray.200"
      opacity={0.95}
      cursor="pointer"
      onClick={scrollToDefenseCard}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // Prevent default space bar scroll
          scrollToDefenseCard();
        }
      }}
      transition="all 0.2s"
      _hover={{
        transform: "translateX(-50%) translateY(2px)",
        boxShadow: "md",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Flex alignItems="center">
            <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
              {defenceCard.JpName}
            </Text>
            {defenceCard.isEvo && (
              <Badge colorScheme="purple" fontSize="2xs" ml={1}>
                EVO
              </Badge>
            )}{" "}
            {/* Show Evo badge */}
            <Icon as={ChevronDownIcon} ml={1} fontSize="xs" color="gray.500" />
          </Flex>
          <Text fontSize="xs" color="gray.500">
            タップでスクロール
          </Text>
        </Box>
        <HStack spacing={3}>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500">
              受けたダメージ
            </Text>
            <Text fontSize="sm" color="red.500" fontWeight="bold">
              {totalDamage}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500">
              残りHP
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={hpColor} // Use calculated color
            >
              {remainingHP}
            </Text>
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};

export default DefenseNotification;
