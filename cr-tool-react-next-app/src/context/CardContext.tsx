import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo, // Import useMemo
  useCallback,
} from "react";
import {
  AnyCard,
  AttackCardState,
  CardContextType,
  CardDatabase,
  NormalCardsData,
  EvoCardsData,
  NormalTroopCard,
  NormalBuildingCard,
  NormalSpellCard,
  EvoTroopCard,
  EvoBuildingCard,
  EvoSpellCard,
  // BaseEvoCard, // No longer needed for assertion
} from "@/types/CardTypes";
import cardDatabase from "@/data/CardData_new.json"; // Import new data

// Import helper functions
import { DEFAULT_DEFENCE_CARD_NAME } from "@/constants"; // Import constant
import { parseDamage, getInitialHp } from "@/utils/cardUtils"; // Import getInitialHp as well

/**
 * Processes the raw card database from JSON into a flattened array of AnyCard objects.
 * Adds `id`, `cardType`, and `isEvo` properties, and cleans up `cycles`.
 * @param db The raw card database object.
 * @returns A flattened array containing all processed card objects.
 */
const processCardDatabase = (db: CardDatabase): AnyCard[] => {
  const allCards: AnyCard[] = [];

  // Define a type for the raw card data structure within the JSON collections
  type RawCardData = Omit<AnyCard, "id" | "cardType" | "isEvo">;
  // RawEvoCardData is no longer needed as cycles is included in the type below
  // type RawEvoCardData = Omit<BaseEvoCard, "id" | "cardType" | "isEvo">; // Not needed

  /**
   * Processes a specific collection (e.g., Normal Troops, Evo Spells) within the database.
   * Iterates through the collection, constructs the final card object with correct types,
   * and handles the 'cycles' property cleanup.
   * @param collection The card collection object (e.g., db.Normal.Troops).
   * @param cardType The type of card ("Troop", "Building", "Spell").
   * @param isEvo Whether the cards in this collection are Evolution cards.
   */
  const processCollection = <
    T extends NormalCardsData | EvoCardsData,
    SpecificCardType extends AnyCard, // Use a more specific generic type constrained by AnyCard
  >(
    collection: T[keyof T],
    cardType: SpecificCardType["cardType"], // Use the specific cardType
    isEvo: boolean,
    // prefix: string, // prefix is no longer needed
  ) => {
    // Iterate through each card entry in the collection
    for (const key in collection) {
      // Assume the raw data includes 'id' and potentially 'cycles'
      const cardDataWithId = collection[key] as RawCardData & {
        id: number;
        cycles?: number;
      };

      // Construct the final card object, adding cardType and isEvo
      const finalCard = {
        ...cardDataWithId,
        cardType: cardType,
        isEvo: isEvo,
      } as SpecificCardType; // Assert the final specific type (e.g., NormalTroopCard)

      // Clean up the 'cycles' property
      if (!isEvo) {
        // If it's not Evo, cycles should ideally not exist.
        // Defensively check and delete if it exists unexpectedly in the raw data.
        if (Object.prototype.hasOwnProperty.call(finalCard, 'cycles')) {
          // Temporarily assert a type that might have cycles to allow deletion
          delete (finalCard as { cycles?: number }).cycles;
        }
      } else {
        // If it IS Evo, assert to the union of specific Evo types to access cycles.
        const evoCard = finalCard as EvoTroopCard | EvoBuildingCard | EvoSpellCard;
        if (evoCard.cycles === undefined || evoCard.cycles === 0) {
          // If cycles is undefined or 0, delete it.
          delete evoCard.cycles; // This should now be allowed as cycles is optional
        }
      }

      allCards.push(finalCard);
    }
  };

  // Process Normal Cards - Pass the specific card type to the generic function
  processCollection<NormalCardsData, NormalTroopCard>(
    db.Normal.Troops,
    "Troop",
    false,
    // "Normal", // prefix removed
  );
  processCollection<NormalCardsData, NormalBuildingCard>(
    db.Normal.Buildings,
    "Building",
    false,
    // "Normal", // prefix removed
  );
  processCollection<NormalCardsData, NormalSpellCard>(
    db.Normal.Spells,
    "Spell",
    false,
    // "Normal", // prefix removed
  );

  // Process Evo Cards - Pass the specific card type to the generic function
  processCollection<EvoCardsData, EvoTroopCard>(
    db.Evo.Troops,
    "Troop",
    true,
    // "Evo", // prefix removed
  );
  processCollection<EvoCardsData, EvoBuildingCard>(
    db.Evo.Buildings,
    "Building",
    true,
    // "Evo", // prefix removed
  );
  processCollection<EvoCardsData, EvoSpellCard>(
    db.Evo.Spells,
    "Spell",
    true,
    // "Evo", // prefix removed
  );

  return allCards;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [allCards, setAllCards] = useState<AnyCard[]>([]);
  const [defenceCard, setDefenceCardInternal] = useState<AnyCard | null>(null);
  const [attackCards, setAttackCards] = useState<AttackCardState[]>([]);

  // Process card data and set initial state on mount
  useEffect(() => {
    try {
      const processedCards = processCardDatabase(cardDatabase as CardDatabase);
      setAllCards(processedCards);

      // Always set default defence card using constant
      const defaultDefenceCard = processedCards.find(
        (card) => card.EnName === DEFAULT_DEFENCE_CARD_NAME && !card.isEvo,
      );
      setDefenceCardInternal(defaultDefenceCard || null);
    } catch (error) {
      console.error("Error processing card database:", error);
      // Handle error appropriately, e.g., set an error state
      setAllCards([]); // Set empty array on error
    }
    // Always initialize with empty attack cards on mount
    setAttackCards([]);

  }, []); // Run only once on mount

  const findCardById = useCallback(
    (id: number): AnyCard | undefined => {
      // Changed id type to number
      return allCards.find((card) => card.id === id); // Comparison is now number === number
    },
    [allCards],
  );

  // Wrapper for setting defence card to ensure consistency
  const setDefenceCard = (card: AnyCard | null) => {
    setDefenceCardInternal(card);
  };

  const addAttackCard = (cardState: AttackCardState) => {
    setAttackCards([...attackCards, cardState]);
  };

  const removeAttackCard = (index: number) => {
    const newAttackCards = [...attackCards];
    newAttackCards.splice(index, 1);
    setAttackCards(newAttackCards);
  };

  const updateAttackCard = (index: number, cardState: AttackCardState) => {
    const newAttackCards = [...attackCards];
    newAttackCards[index] = cardState;
    setAttackCards(newAttackCards);
  };

  // Function to get potential damage options for a card
  const getDamageOptions = useCallback(
    (cardId: number): { key: string; value: number | string }[] => {
      // Changed cardId type to number
      const card = findCardById(cardId); // Pass number to findCardById
      if (!card) return [];

      const options: { key: string; value: number | string }[] = [];
      const seenKeys = new Set<string>(); // To avoid duplicate keys if present in both stats and base

      // Add stats first
      for (const key in card.stats) {
        const lowerKey = key.toLowerCase();
        // Exclude DPS keys and ensure it's damage/heal related
        if (
          !lowerKey.includes("dps") &&
          !lowerKey.includes("damage_per_second") &&
          (lowerKey.includes("damage") || lowerKey.includes("heal"))
        ) {
          const value = card.stats[key];
          if (
            (typeof value === "number" || typeof value === "string") &&
            parseDamage(value) > 0
          ) {
            options.push({ key, value });
            seenKeys.add(key);
          }
        }
      }

      // Sort alphabetically for consistent order
      options.sort((a, b) => a.key.localeCompare(b.key));
      return options;
    },
    [findCardById],
  );

  // Memoize the calculated total damage
  const totalDamage = useMemo(() => {
    return attackCards.reduce((currentTotalDamage, attackCardState) => {
      const card = findCardById(attackCardState.cardId);
      if (!card) return currentTotalDamage;

      let cardTotalDamage = 0;
      if (
        attackCardState.attackNumbers &&
        typeof attackCardState.attackNumbers === "object" &&
        attackCardState.attackNumbers !== null
      ) {
        for (const [damageKey, attackCount] of Object.entries(
          attackCardState.attackNumbers,
        )) {
          if (
            card.stats.hasOwnProperty(damageKey) &&
            !damageKey.toLowerCase().includes("dps") &&
            !damageKey.toLowerCase().includes("damage_per_second")
          ) {
            const damagePerAttack = parseDamage(card.stats[damageKey]);
            const numericAttackCount = typeof attackCount === 'number' ? attackCount : 0;
            cardTotalDamage += damagePerAttack * numericAttackCount;
          }
        }
      }
      return currentTotalDamage + cardTotalDamage;
    }, 0);
  }, [attackCards, findCardById]);

  // Memoize the calculated remaining HP
  const remainingHP = useMemo(() => {
    if (!defenceCard) return 0;
    // Use getInitialHp from utils
    const initialHitpoints = getInitialHp(defenceCard);
    if (initialHitpoints <= 0) return 0;
    return Math.max(0, initialHitpoints - totalDamage);
  }, [defenceCard, totalDamage]); // Depend on defenceCard and the memoized totalDamage

  // Function to reset defence and attack cards to initial state
  const resetState = useCallback(() => {
    // Find the default defence card (Knight) again
    const defaultDefenceCard = allCards.find( // Use constant here too
      (card) => card.EnName === DEFAULT_DEFENCE_CARD_NAME && !card.isEvo,
    );
    setDefenceCardInternal(defaultDefenceCard || null);
    // Reset attack cards to an empty array
    setAttackCards([]);
  }, [allCards]); // Dependency on allCards as it's used to find the default


  const value: CardContextType = {
    allCards, // State
    attackCards, // State
    defenceCard, // State
    totalDamage, // Memoized value
    remainingHP, // Memoized value
    setDefenceCard, // Action
    addAttackCard, // Action
    removeAttackCard, // Action
    updateAttackCard, // Action
    findCardById, // Helper/Selector
    getDamageOptions, // Helper/Selector
    resetState, // Action
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};
