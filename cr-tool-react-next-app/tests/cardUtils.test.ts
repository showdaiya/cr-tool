import { describe, it, expect } from "vitest";
import {
  parseDamage,
  getInitialHp,
  getCardImageFilename,
  getStatValue,
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
