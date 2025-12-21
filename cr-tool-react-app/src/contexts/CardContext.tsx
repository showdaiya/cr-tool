import { createContext, useContext, ReactNode } from 'react';
import { TroopCard , SpellCard, AttackCardType } from '../types/types';
import CardData from '../assets/CardData.json';
import { useState } from 'react';

// 型定義
interface CardContextType {
  troops: Record<string, TroopCard>;
  spells: Record<string, SpellCard>;
  attackCards: Record<number, AttackCardType>;
  attackLastIndex: number;
  defenseCard: string;
  // 更新用の関数
  setAttackCards: (
    cards: Record<number, AttackCardType> |
    ((prev: Record<number, AttackCardType>) => Record<number, AttackCardType>)
  ) => void;
  setAttackLastIndex: (index: number) => void;
  setDefenseCard: (cardName: string) => void;
}

// Context作成
const CardContext = createContext<CardContextType | undefined>(undefined);

// Provider Component
export function CardProvider({ children }: { children: ReactNode }) {
  const [attackCards, setAttackCards] = useState<Record<number, AttackCardType>>({});
  const [attackLastIndex, setAttackLastIndex] = useState<number>(-1);
  const [defenseCard, setDefenseCard] = useState<string>('Knight');

  const value = {
    troops: CardData.Troops as Record<string, TroopCard>,
    spells: CardData.Spells as Record<string, SpellCard>,
    attackCards,
    attackLastIndex,
    defenseCard,
    setAttackCards,
    setAttackLastIndex,
    setDefenseCard
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
}

// Custom Hooks
export function useTroops() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useTroops must be used within CardProvider');
  return context.troops;
}

export function useSpells() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useSpells must be used within CardProvider');
  return context.spells;
}

export function useAttackCards() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useAttackCards must be used within CardProvider');
  return [context.attackCards, context.setAttackCards] as const;
}

export function useAttackLastIndex() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useAttackLastIndex must be used within CardProvider');
  return [context.attackLastIndex, context.setAttackLastIndex] as const;
}

export function useDefenseCard() {
  const context = useContext(CardContext);
  if (!context) throw new Error('useDefenseCard must be used within CardProvider');
  return [context.defenseCard, context.setDefenseCard] as const;
}
