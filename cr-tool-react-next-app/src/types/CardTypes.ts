// Card Rarity Types
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "CHAMPION";

// Common Stats Interface with known properties and index signature for flexibility
export interface Stats {
  // Known properties (optional)
  hitpoints?: number | string;
  shield_hitpoints?: number | string;
  damage?: number | string;
  area_damage?: number | string;
  ranged_damage?: number | string;
  crown_tower_damage?: number | string;
  death_damage?: number | string;
  spawn_damage?: number | string;
  dash_damage?: number | string;
  damage_per_second?: number | string; // Often calculated, but might be in data
  hit_speed?: string; // Typically string like "1.2 sec"
  speed?: string; // Typically string like "Fast", "Medium"
  range?: number | string; // Can be number or string like "Melee: Short"
  targets?: string; // Typically string like "AIR & GROUND"
  count?: string; // Typically string like "x3"
  duration?: string; // Typically string like "1 sec"
  freeze_duration?: string;
  stun_duration?: string;
  deploy_time?: string;
  lifetime?: string;
  radius?: number;
  width?: number;
  // ... add other common stats as needed

  // Index signature for any other potential stats
  [key: string]: number | string | boolean | undefined;
}

// Base Card Interface (common properties for all cards)
export interface BaseCard {
  EnName: string;
  JpName: string;
  ElixirCost: number;
  rarity: Rarity;
  attack: boolean; // Added
  defence: boolean; // Added
  stats: Stats;
  // Add an identifier for the card, combining type and key
  id: number; // Changed from string to number
  // Add card type explicitly for easier filtering/identification
  cardType: "Troop" | "Building" | "Spell";
  // Add evolution status
  isEvo: boolean;
}

// --- Normal Cards ---

// Normal Troop Card Interface
export interface NormalTroopCard extends BaseCard {
  cardType: "Troop";
  isEvo: false;
}

// Normal Building Card Interface
export interface NormalBuildingCard extends BaseCard {
  cardType: "Building";
  isEvo: false;
}

// Normal Spell Card Interface
export interface NormalSpellCard extends BaseCard {
  cardType: "Spell";
  isEvo: false;
}

// Collection Types for Normal Cards in JSON
export interface NormalTroopCollection {
  [cardId: string]: Omit<NormalTroopCard, "id" | "cardType" | "isEvo">;
}

export interface NormalBuildingCollection {
  [cardId: string]: Omit<NormalBuildingCard, "id" | "cardType" | "isEvo">;
}

export interface NormalSpellCollection {
  [cardId: string]: Omit<NormalSpellCard, "id" | "cardType" | "isEvo">;
}

// Normal Cards Container in JSON
export interface NormalCardsData {
  Troops: NormalTroopCollection;
  Buildings: NormalBuildingCollection;
  Spells: NormalSpellCollection;
}

// --- Evolution Cards ---

// Base Evolution Card Interface (adds cycles property)
export interface BaseEvoCard extends BaseCard {
  cycles?: number; // Make cycles optional as it might be deleted
  isEvo: true;
}

// Troop Evolution Card Interface
export interface EvoTroopCard extends BaseEvoCard {
  cardType: "Troop";
}

// Building Evolution Card Interface
export interface EvoBuildingCard extends BaseEvoCard {
  cardType: "Building";
}

// Spell Evolution Card Interface
export interface EvoSpellCard extends BaseEvoCard {
  cardType: "Spell";
}

// Collection Types for Evolution Cards in JSON
export interface EvoTroopCollection {
  [cardId: string]: Omit<EvoTroopCard, "id" | "cardType" | "isEvo">;
}

export interface EvoBuildingCollection {
  [cardId: string]: Omit<EvoBuildingCard, "id" | "cardType" | "isEvo">;
}

export interface EvoSpellCollection {
  [cardId: string]: Omit<EvoSpellCard, "id" | "cardType" | "isEvo">;
}

// Evolution Cards Container in JSON
export interface EvoCardsData {
  Troops: EvoTroopCollection;
  Buildings: EvoBuildingCollection;
  Spells: EvoSpellCollection;
}

// --- Complete Card Data Structure ---

// Complete Card Collection from JSON
export interface CardDatabase {
  Normal: NormalCardsData;
  Evo: EvoCardsData;
}

// Union type for any card after processing
export type AnyCard =
  | NormalTroopCard
  | NormalBuildingCard
  | NormalSpellCard
  | EvoTroopCard
  | EvoBuildingCard
  | EvoSpellCard;

// Type for representing a selected attack card state
export interface AttackCardState {
  cardId: number; // Use the unique card ID (Changed from string to number)
  // Map damage keys (like 'damage', 'area_damage') to their attack counts
  attackNumbers: { [damageKey: string]: number };
}

// Type for the Card Context
export interface CardContextType {
  allCards: AnyCard[]; // Flattened list of all cards
  attackCards: AttackCardState[]; // State
  defenceCard: AnyCard | null; // State
  totalDamage: number; // Memoized value
  remainingHP: number; // Memoized value
  setDefenceCard: (card: AnyCard | null) => void; // Action
  addAttackCard: (cardState: AttackCardState) => void; // Action
  removeAttackCard: (index: number) => void; // Action
  updateAttackCard: (index: number, cardState: AttackCardState) => void; // Action
  findCardById: (id: number) => AnyCard | undefined; // Helper/Selector
  getDamageOptions: (
    cardId: number, // Helper/Selector
  ) => { key: string; value: number | string }[]; // Get damage options for a card
  resetState: () => void; // Add the reset function type
}
