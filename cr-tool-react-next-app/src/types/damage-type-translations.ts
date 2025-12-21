// ダメージタイプの英語表現を定義する型
type DamageType =
  | "damage"
  | "area_damage"
  | "ranged_damage"
  | "damage_per_second"
  | "death_damage"
  | "crown_tower_damage"
  | "crown_tower_damage_per_sec"
  | "spawn_damage"
  | "charge_damage"
  | "jump_damage"
  | "bounce_damage"
  | "ice_blast_damage"
  | "tornado_damage"
  | "explosion_damage"
  | "pulse_damage"
  | "recoil_damage"
  | "pushback_damage"
  | "barrage_damage"
  | "reflected_damage"
  | "reflected_tower_damage"
  | "power_shot_damage"
  | "sniper_damage"
  | "building_damage_per_sec"
  | "combo_damage"
  | "extra_chain_damage";

// 英語のダメージタイプから日本語表現へのマッピング
const damageTypeTranslations: Record<DamageType, string> = {
  damage: "ダメージ",
  area_damage: "範囲ダメージ",
  ranged_damage: "遠距離ダメージ",
  damage_per_second: "毎秒ダメージ",
  death_damage: "死亡時ダメージ",
  crown_tower_damage: "タワーへのダメージ",
  crown_tower_damage_per_sec: "タワーへの毎秒ダメージ",
  spawn_damage: "召喚ダメージ",
  charge_damage: "突撃ダメージ",
  jump_damage: "ジャンプダメージ",
  bounce_damage: "バウンスのダメージ",
  ice_blast_damage: "アイスブラストのダメージ",
  tornado_damage: "トルネードのダメージ",
  explosion_damage: "爆発のダメージ",
  pulse_damage: "パルスのダメージ",
  recoil_damage: "反動ダメージ",
  pushback_damage: "ノックバックのダメージ",
  barrage_damage: "爆撃のダメージ",
  reflected_damage: "反射ダメージ",
  reflected_tower_damage: "反射タワーダメージ",
  power_shot_damage: "パワーショットのダメージ",
  sniper_damage: "狙撃ダメージ",
  building_damage_per_sec: "建物への毎秒ダメージ",
  combo_damage: "連打ダメージ",
  extra_chain_damage: "追加連鎖ダメージ",
};

/**
 * 英語のダメージタイプを日本語に変換する関数
 * @param type 英語のダメージタイプ
 * @returns 対応する日本語表現
 */
function translateDamageType(type: DamageType): string {
  return damageTypeTranslations[type];
}

/**
 * カードのstatsオブジェクトから、ダメージタイプのキーを検出し、日本語表示名と値のペアを返す関数
 * @param stats カードの統計情報オブジェクト
 * @returns 日本語表示名と値のペアの配列
 */
function getTranslatedDamageStats(
  stats: Record<string, string>,
): Array<{ label: string; value: string }> {
  return Object.entries(stats)
    .filter(([key]) => Object.keys(damageTypeTranslations).includes(key))
    .map(([key, value]) => ({
      label: damageTypeTranslations[key as DamageType],
      value,
    }));
}

// 使用例
/*
const iceSpirit = {
  "hitpoints": 230,
  "targets": "AIR & GROUND",
  "range": 2.5,
  "area_damage": 110,
  "freeze_duration": "1.2 sec",
  "speed": "Very Fast"
};

// 日本語のダメージ情報を取得
const damageInfo = getTranslatedDamageStats(iceSpirit);
console.log(damageInfo);
// 出力: [{ label: '範囲攻撃力', value: 110 }]
*/

export type { DamageType };
export {
  damageTypeTranslations,
  translateDamageType,
  getTranslatedDamageStats,
};
