import { AnyCard } from "../types/CardTypes";

/**
 * ダメージ値を表す文字列または数値を解析し、数値に変換します。
 * "X xY" 形式や "A-B" 形式（最初の値を採用）も処理します。
 * @param damageValue 解析するダメージ値 (number, string, boolean, undefined)
 * @returns 解析されたダメージの数値。解析不能な場合は 0。
 */
export const parseDamage = (
  damageValue: number | string | boolean | undefined,
): number => {
  if (typeof damageValue === "number") {
    return damageValue;
  }
  if (typeof damageValue === "string") {
    // Handle "X xY" format
    if (damageValue.includes("x")) {
      const parts = damageValue
        .split("x")
        .map((part) => parseInt(part.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return parts[0] * parts[1];
      }
    }
    // Handle "A-B" format (take the first value)
    if (damageValue.includes("-")) {
      const parts = damageValue
        .split("-")
        .map((part) => parseInt(part.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0])) {
        return parts[0];
      }
    }
    // Try parsing as a simple number
    const parsed = parseInt(damageValue, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0; // Default for boolean or undefined
};

/**
 * カードオブジェクトから初期HPを取得します。'hitpoints' または 'shield_hitpoints' を考慮します。
 * @param card HPを取得するカードオブジェクト (AnyCard | null)
 * @returns 初期HPの数値。取得できない場合は 0。
 */
export const getInitialHp = (card: AnyCard | null): number => {
  if (!card || !card.stats) return 0;
  const hpKeys = ["hitpoints", "shield_hitpoints"];
  for (const key of hpKeys) {
    if (card.stats.hasOwnProperty(key)) {
      const value = card.stats[key];
      // Use parseDamage for consistency, though direct number/string parsing might suffice here
      const hp = parseDamage(value);
      if (hp > 0) {
        return hp;
      }
    }
  }
  return 0;
};

/**
 * カードIDを3桁のゼロ埋め文字列にフォーマットします。
 * @param id カードID (number)
 * @returns フォーマットされたID文字列 (例: "001")
 */
export const formatCardId = (id: number): string => {
  return String(id).padStart(3, "0");
};

/**
 * カードオブジェクトから画像ファイル名を生成します。
 * 英語名に含まれるドットやスペースはアンダースコアに置換されます。
 * @param card ファイル名を生成するカードオブジェクト (AnyCard)
 * @returns 画像ファイル名 (例: "card_001_Knight.png")
 */
export const getCardImageFilename = (card: AnyCard): string => {
  // Handle potential special characters in EnName for filenames
  const formattedEnName = card.EnName.replace(/[.\s]/g, "_"); // Replace dots and spaces with underscores
  return `card_${formatCardId(card.id)}_${formattedEnName}.png`;
};

/**
 * カードの統計情報から指定されたキーに対応する数値を取得します。
 * 文字列の場合は parseFloat で解析を試みます。
 * @param card 統計情報を取得するカードオブジェクト (AnyCard)
 * @param key 取得する統計情報のキー (string)
 * @returns 統計情報の数値。取得または解析不能な場合は 0。
 */
export const getStatValue = (card: AnyCard, key: string): number => {
  if (card.stats && card.stats.hasOwnProperty(key)) {
    const value = card.stats[key];
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      // Basic parsing for sorting (might need refinement for ranges like "90-1057")
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
  }
  return 0;
};