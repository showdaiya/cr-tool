import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { TooltipProvider } from "@/components/ui/tooltip";

expect.extend(matchers);
import AttackCard from "../src/components/AttackCard";
import DefenceCard from "../src/components/DefenceCard";
import DefenseNotification from "../src/components/DefenseNotification";
import SelectCardOverlay from "../src/components/SelectCardOverlay";
import type { AnyCard, AttackCardState, CardContextType } from "../src/types/CardTypes";

let mockContext: CardContextType;

vi.mock("@/context/CardContext", () => ({
  useCardContext: () => mockContext,
}));

const baseCard: AnyCard = {
  id: 1,
  JpName: "ナイト",
  EnName: "Knight",
  ElixirCost: 3,
  rarity: "COMMON",
  cardType: "Troop",
  attack: true,
  defence: true,
  isEvo: false,
  stats: {
    hitpoints: 1000,
    damage: 200,
  },
};

const evoCard: AnyCard = {
  ...baseCard,
  id: 2,
  EnName: "Knight Evo",
  JpName: "ナイトEvo",
  isEvo: true,
  stats: {
    hitpoints: 1200,
    damage: 250,
  },
};

beforeEach(() => {
  mockContext = {
    allCards: [baseCard, evoCard],
    attackCards: [],
    defenceCard: baseCard,
    totalDamage: 200,
    remainingHP: 800,
    addAttackCard: vi.fn(),
    removeAttackCard: vi.fn(),
    updateAttackCard: vi.fn(),
    setDefenceCard: vi.fn(),
    resetState: vi.fn(),
    findCardById: (id: number) => [baseCard, evoCard].find((c) => c.id === id),
    getDamageOptions: () => [{ key: "damage", value: 200 }],
  };
});

describe("AttackCard (shadcn)", () => {
  it("renders card info and damage inputs", () => {
    const attackState: AttackCardState = { cardId: 1, attackNumbers: { damage: 2 } };
    render(
      <TooltipProvider>
        <AttackCard
          attackCard={attackState}
          index={0}
          onEditClick={vi.fn()}
          onRemove={vi.fn()}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("ナイト")).toBeInTheDocument();
    expect(screen.getByText(/ダメージ:/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByText("編集")).toBeInTheDocument();
    expect(screen.getByText("削除")).toBeInTheDocument();
  });
});

describe("DefenceCard (shadcn)", () => {
  it("shows HP and remaining values", () => {
    render(
      <TooltipProvider>
        <DefenceCard onSelectClick={vi.fn()} />
      </TooltipProvider>,
    );
    expect(screen.getByText("初期HP")).toBeInTheDocument();
    expect(screen.getByText("受けたダメージ")).toBeInTheDocument();
    expect(screen.getByText("残りHP")).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument(); // remainingHP
  });
});

describe("DefenseNotification (shadcn)", () => {
  it("prompts selection when defence card is missing", () => {
    mockContext.defenceCard = null;
    render(
      <TooltipProvider>
        <DefenseNotification onSelectDefenseCard={vi.fn()} />
      </TooltipProvider>,
    );
    expect(screen.getByText("防衛カードが選択されていません")).toBeInTheDocument();
  });

  it("shows HP summary when defence card exists", () => {
    render(
      <TooltipProvider>
        <DefenseNotification onSelectDefenseCard={vi.fn()} />
      </TooltipProvider>,
    );
    expect(screen.getByText("ナイト")).toBeInTheDocument();
    expect(screen.getByText("残りHP")).toBeInTheDocument();
  });
});

describe("SelectCardOverlay (shadcn)", () => {
  it("renders list after delay and allows selection", async () => {
    vi.useFakeTimers();
    render(
      <SelectCardOverlay
        isOpen
        onClose={vi.fn()}
        modalTitle="攻撃カードを選択"
        cardFilter={(card) => card.attack === true}
        allowedCardTypes={["Troop", "Building", "Spell"]}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(60);
    });

    expect(screen.getByText("ナイト")).toBeInTheDocument();
    fireEvent.click(screen.getByText("ナイト"));
    expect(screen.getByText("選択")).toBeEnabled();
    vi.useRealTimers();
  });

  it("respects dark mode rendering", async () => {
    vi.useFakeTimers();
    document.documentElement.classList.add("dark");
    render(
      <SelectCardOverlay
        isOpen
        onClose={vi.fn()}
        modalTitle="防衛カードを選択"
        cardFilter={(card) => card.defence === true}
        allowedCardTypes={["Troop", "Building"]}
        onConfirm={vi.fn()}
      />,
    );
    await act(async () => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.getByText("ナイト")).toBeInTheDocument();
    document.documentElement.classList.remove("dark");
    vi.useRealTimers();
  });
});
