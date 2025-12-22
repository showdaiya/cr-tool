import { describe, it, expect } from "vitest";
import {
  parseDamage,
  getInitialHp,
  getCardImageFilename,
  getStatValue,
  getHpState,
  getHpColorClass,
  getHpIndicatorClass,
} from "../src/utils/cardUtils";
import type { AnyCard } from "../src/types/CardTypes";

const baseCard = (overrides: Partial<AnyCard> = {}): AnyCard => ({
  EnName: "Knight",
  JpName: "ナイト",
  ElixirCost: 3,
  rarity: "COMMON",
  attack: true,
  defence: true,
  stats: { hitpoints: 1766, damage: 202 },
  id: 1,
  cardType: "Troop",
  isEvo: false,
  ...overrides,
});

describe("parseDamage", () => {
  it("returns number as-is", () => {
    expect(parseDamage(120)).toBe(120);
  });

  it("parses 'X xY' multiplicative format", () => {
    expect(parseDamage("64 x5")).toBe(320);
  });

  it("parses range 'A-B' and takes first value", () => {
    expect(parseDamage("90-1057")).toBe(90);
  });

  it("returns 0 for invalid strings", () => {
    expect(parseDamage("not-a-number")).toBe(0);
  });

  it("returns 0 for undefined/boolean", () => {
    expect(parseDamage(undefined)).toBe(0);
    expect(parseDamage(false)).toBe(0);
  });
});

describe("getInitialHp", () => {
  it("prioritizes hitpoints", () => {
    const card = baseCard({ stats: { hitpoints: 500, shield_hitpoints: 300 } });
    expect(getInitialHp(card)).toBe(500);
  });

  it("falls back to shield_hitpoints", () => {
    const card = baseCard({ stats: { shield_hitpoints: 250 } });
    expect(getInitialHp(card)).toBe(250);
  });

  it("returns 0 when no hp stats", () => {
    const card = baseCard({ stats: {} });
    expect(getInitialHp(card)).toBe(0);
  });
});

describe("getCardImageFilename", () => {
  it("formats ID with zero padding and replaces spaces/dots with underscores", () => {
    const card = baseCard({ id: 42, EnName: "Mini P.E.K.K.A" });
    expect(getCardImageFilename(card)).toBe("card_042_Mini_P_E_K_K_A.png");
  });
});

describe("getStatValue", () => {
  it("returns numeric stats directly", () => {
    const card = baseCard({ stats: { hitpoints: 1234 } });
    expect(getStatValue(card, "hitpoints")).toBe(1234);
  });

  it("parses numeric strings", () => {
    const card = baseCard({ stats: { damage: "250" } });
    expect(getStatValue(card, "damage")).toBe(250);
  });

  it("returns 0 for missing keys", () => {
    const card = baseCard({ stats: { damage: 100 } });
    expect(getStatValue(card, "area_damage")).toBe(0);
  });
});

describe("getHpState", () => {
  it("returns 'low' for percentage at 0", () => {
    expect(getHpState(0)).toBe("low");
  });

  it("returns 'low' for percentage at boundary 20", () => {
    expect(getHpState(20)).toBe("low");
  });

  it("returns 'low' for percentage below 20", () => {
    expect(getHpState(10)).toBe("low");
  });

  it("returns 'medium' for percentage at boundary 50", () => {
    expect(getHpState(50)).toBe("medium");
  });

  it("returns 'medium' for percentage between 20 and 50", () => {
    expect(getHpState(35)).toBe("medium");
  });

  it("returns 'high' for percentage at 100", () => {
    expect(getHpState(100)).toBe("high");
  });

  it("returns 'high' for percentage above 50", () => {
    expect(getHpState(75)).toBe("high");
  });

  it("handles negative percentages by clamping to 0 (low)", () => {
    expect(getHpState(-10)).toBe("low");
  });

  it("handles percentages > 100 by clamping to 100 (high)", () => {
    expect(getHpState(150)).toBe("high");
  });
});

describe("getHpColorClass", () => {
  it("returns red text color for low HP (0%)", () => {
    expect(getHpColorClass(0)).toBe("text-[#ef4444]");
  });

  it("returns red text color for low HP (20%)", () => {
    expect(getHpColorClass(20)).toBe("text-[#ef4444]");
  });

  it("returns yellow text color for medium HP (50%)", () => {
    expect(getHpColorClass(50)).toBe("text-[#eab308]");
  });

  it("returns yellow text color for medium HP (35%)", () => {
    expect(getHpColorClass(35)).toBe("text-[#eab308]");
  });

  it("returns green text color for high HP (100%)", () => {
    expect(getHpColorClass(100)).toBe("text-[#22c55e]");
  });

  it("returns green text color for high HP (75%)", () => {
    expect(getHpColorClass(75)).toBe("text-[#22c55e]");
  });

  it("handles negative percentages correctly", () => {
    expect(getHpColorClass(-10)).toBe("text-[#ef4444]");
  });

  it("handles percentages > 100 correctly", () => {
    expect(getHpColorClass(150)).toBe("text-[#22c55e]");
  });
});

describe("getHpIndicatorClass", () => {
  it("returns red background color for low HP (0%)", () => {
    expect(getHpIndicatorClass(0)).toBe("bg-[#ef4444]");
  });

  it("returns red background color for low HP (20%)", () => {
    expect(getHpIndicatorClass(20)).toBe("bg-[#ef4444]");
  });

  it("returns yellow background color for medium HP (50%)", () => {
    expect(getHpIndicatorClass(50)).toBe("bg-[#eab308]");
  });

  it("returns yellow background color for medium HP (35%)", () => {
    expect(getHpIndicatorClass(35)).toBe("bg-[#eab308]");
  });

  it("returns green background color for high HP (100%)", () => {
    expect(getHpIndicatorClass(100)).toBe("bg-[#22c55e]");
  });

  it("returns green background color for high HP (75%)", () => {
    expect(getHpIndicatorClass(75)).toBe("bg-[#22c55e]");
  });

  it("handles negative percentages correctly", () => {
    expect(getHpIndicatorClass(-10)).toBe("bg-[#ef4444]");
  });

  it("handles percentages > 100 correctly", () => {
    expect(getHpIndicatorClass(150)).toBe("bg-[#22c55e]");
  });
});
