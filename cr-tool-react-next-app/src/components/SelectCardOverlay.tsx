import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Box,
  Text,
  Input,
  List,
  HStack,
  Select,
  IconButton,
  Spinner,
  Center,
  Tabs, // Keep Tabs related imports
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useState, useMemo, useCallback, useEffect } from "react"; // Removed memo import
import { useCardContext } from "@/context/CardContext";
import { AnyCard, AttackCardState } from "@/types/CardTypes"; // Removed CardContextType import
import { getStatValue } from "@/utils/cardUtils";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { OVERLAY_LIST_RENDER_DELAY_MS } from "@/constants";
import useResetStateOnClose from "@/hooks/useResetStateOnClose";
import SelectableCardListItem from "./SelectableCardListItem"; // Import the unified list item

// Define sort key type (including id)
type SortKey =
  | "id"
  | "JpName"
  | "EnName"
  | "ElixirCost"
  | "hitpoints"
  | "damage"
  | "area_damage"
  | "ranged_damage"; // Add other relevant stats if needed
type SortOrder = "asc" | "desc";
type CardTypeFilter = AnyCard["cardType"];

type SelectCardOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  // Function to filter cards based on specific criteria (e.g., attack/defence)
  cardFilter: (card: AnyCard) => boolean;
  // Array of card types to display (used for tabs in attack overlay)
  allowedCardTypes: CardTypeFilter[];
  // Callback when a card is confirmed
  onConfirm: (selected: AnyCard | AttackCardState) => void;
  // Optional initial selected card (useful for defence overlay)
  initialSelectedCard?: AnyCard | null;
};

const SelectCardOverlay = ({
  isOpen,
  onClose,
  modalTitle,
  cardFilter,
  allowedCardTypes,
  onConfirm,
  initialSelectedCard = null, // Default to null
}: SelectCardOverlayProps) => {
  const { allCards } = useCardContext();
  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(
    initialSelectedCard,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id"); // Default to ID sort
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showEvo, setShowEvo] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const [currentTab, setCurrentTab] = useState<CardTypeFilter | "All">(
    allowedCardTypes.length > 1 ? allowedCardTypes[0] : "All",
  ); // Manage tab state if multiple types allowed

  // Effect to handle list rendering delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Reset readiness on open before setting timer
      setIsListReady(false);
      timer = setTimeout(() => {
        setIsListReady(true);
      }, OVERLAY_LIST_RENDER_DELAY_MS);
    } else {
      // Ensure readiness is false when closed
      setIsListReady(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Effect to reset state when modal closes
  const resetLocalState = useCallback(() => {
    setSelectedCard(initialSelectedCard); // Reset to initial or null
    setSearchQuery("");
    setSortKey("id");
    setSortOrder("asc");
    setShowEvo(false);
    setCurrentTab(allowedCardTypes.length > 1 ? allowedCardTypes[0] : "All");
    // isListReady is handled by the other useEffect
  }, [initialSelectedCard, allowedCardTypes]);

  useResetStateOnClose(isOpen, resetLocalState);

  // Update selected card when initialSelectedCard prop changes (e.g., defence card updated externally)
  useEffect(() => {
    setSelectedCard(initialSelectedCard);
  }, [initialSelectedCard]);


  const handleSelectCard = useCallback((card: AnyCard) => {
    setSelectedCard(card);
  }, []);

  const handleConfirmClick = () => {
    if (selectedCard) {
      // For attack overlay, return AttackCardState, otherwise return AnyCard
      if (modalTitle === "攻撃カードを選択") {
        const attackState: AttackCardState = {
          cardId: selectedCard.id,
          attackNumbers: {}, // Initialize empty, to be set in AttackCard
        };
        onConfirm(attackState);
      } else {
        onConfirm(selectedCard);
      }
      onClose();
    }
  };

  // Memoized sort function
  const sortCards = useCallback(
    (cards: AnyCard[], key: SortKey, order: SortOrder): AnyCard[] => {
      return [...cards].sort((a, b) => {
        let valA: number | string;
        let valB: number | string;

        if (key === "JpName") { valA = a.JpName; valB = b.JpName; }
        else if (key === "EnName") { valA = a.EnName; valB = b.EnName; }
        else if (key === "id") { valA = a.id; valB = b.id; }
        else if (key === "ElixirCost") { valA = a.ElixirCost; valB = b.ElixirCost; }
        else {
          valA = getStatValue(a, key);
          valB = getStatValue(b, key);
          if (isNaN(valA)) valA = order === "asc" ? Infinity : -Infinity;
          if (isNaN(valB)) valB = order === "asc" ? Infinity : -Infinity;
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return order === "asc"
            ? valA.localeCompare(valB, "ja")
            : valB.localeCompare(valA, "ja");
        } else if (typeof valA === "number" && typeof valB === "number") {
          return order === "asc" ? valA - valB : valB - valA;
        } else {
          return 0;
        }
      });
    },
    [],
  );

  // Memoized function to get filtered and sorted cards for a specific type or all
  const getFilteredAndSortedCards = useCallback(
    (targetType: CardTypeFilter | "All") => {
      const filtered = allCards.filter(
        (card) =>
          cardFilter(card) && // Apply the specific filter (attack/defence)
          (targetType === "All" || card.cardType === targetType) && // Filter by tab/type if applicable
          (showEvo ? card.isEvo : !card.isEvo) && // Filter by Evo status
          (card.JpName.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by search query
           card.EnName.toLowerCase().includes(searchQuery.toLowerCase())),
      );

      // Adjust sort key if not applicable for the current card type (e.g., hitpoints for spells)
      let applicableSortKey = sortKey;
      if (targetType === "Spell" && sortKey === "hitpoints") {
        applicableSortKey = "JpName";
      }
      // Add more rules if needed

      return sortCards(filtered, applicableSortKey, sortOrder);
    },
    [allCards, cardFilter, showEvo, searchQuery, sortKey, sortOrder, sortCards],
  );

  // Determine if tabs should be shown
  const showTabs = allowedCardTypes.length > 1;

  // Get the list of cards to display based on the current tab (or all if no tabs)
  const cardsToDisplay = useMemo(() => {
      return getFilteredAndSortedCards(currentTab);
  }, [getFilteredAndSortedCards, currentTab]);


  // Handle tab change
  const handleTabChange = (index: number) => {
      if (showTabs) {
          setCurrentTab(allowedCardTypes[index]);
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        mt="50px"
        maxH="calc(100vh - 70px)"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto" flex="1" pb={2}>
          <VStack spacing={4} align="stretch">
            {/* Search Input */}
            <Input
              placeholder="カード名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              mb={2}
            />
            {/* Sort and Filter Controls */}
            <HStack mb={4} spacing={2} justify="space-between">
              <HStack flex="1" spacing={2}>
                <Select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  size="sm"
                  flex="1"
                >
                  <option value="id">ID</option>
                  <option value="JpName">日本語名</option>
                  <option value="EnName">英語名</option>
                  <option value="ElixirCost">エリクサーコスト</option>
                  <option value="hitpoints">HP</option>
                  <option value="damage">ダメージ(単体)</option>
                  <option value="area_damage">ダメージ(範囲)</option>
                  <option value="ranged_damage">ダメージ(遠距離)</option>
                  {/* Add other relevant stats keys */}
                </Select>
                <IconButton
                  aria-label="Sort order"
                  icon={
                    sortOrder === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />
                  }
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  size="sm"
                />
              </HStack>
              <Button size="sm" onClick={() => setShowEvo(!showEvo)}>
                {showEvo ? "通常表示" : "進化表示"}
              </Button>
            </HStack>

            {/* Tabs (only if multiple allowed types) or direct list */}
            {showTabs ? (
              <Tabs variant="enclosed" isLazy index={allowedCardTypes.indexOf(currentTab as CardTypeFilter)} onChange={handleTabChange}>
                <TabList>
                  {allowedCardTypes.map((type) => (
                    <Tab key={type}>{type === "Troop" ? "ユニット" : type === "Building" ? "建物" : "呪文"}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {allowedCardTypes.map((type) => (
                    <TabPanel key={type} p={0} pt={4}>
                      {isListReady ? (
                        <List spacing={2}>
                          {/* We need to recalculate or filter cardsToDisplay here based on type */}
                          {getFilteredAndSortedCards(type).map((card) => (
                            <SelectableCardListItem
                              key={`${card.id}-${card.EnName}-${card.isEvo}`}
                              card={card}
                              isSelected={selectedCard?.id === card.id}
                              onSelect={handleSelectCard}
                            />
                          ))}
                          {getFilteredAndSortedCards(type).length === 0 && (
                             <Text color="gray.500" textAlign="center" mt={4}>該当なし</Text>
                          )}
                        </List>
                      ) : (
                        <Center h="100px"><Spinner /></Center>
                      )}
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            ) : (
              // Direct list rendering if only one type or no tabs needed
              isListReady ? (
                <Box overflowY="auto">
                  <List spacing={2}>
                    {cardsToDisplay.map((card) => (
                      <SelectableCardListItem
                        key={`${card.id}-${card.EnName}-${card.isEvo}`}
                        card={card}
                        isSelected={selectedCard?.id === card.id}
                        onSelect={handleSelectCard}
                      />
                    ))}
                    {cardsToDisplay.length === 0 && (
                      <Text color="gray.500" textAlign="center" mt={4}>該当するカードがありません。</Text>
                    )}
                  </List>
                </Box>
              ) : (
                <Center h="100px"><Spinner /></Center>
              )
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderTopColor="gray.200">
          <Button variant="ghost" mr={3} onClick={onClose}>
            キャンセル
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleConfirmClick}
            isDisabled={!selectedCard}
          >
            選択
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectCardOverlay;