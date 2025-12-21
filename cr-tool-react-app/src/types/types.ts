// 基本カード情報
export interface BaseCard {
  EnName: string;
  JpName: string;
  Type: "Troop" | "Spell" | null;
  Icon: string;
}

// 部隊カード
export interface TroopCard extends BaseCard {
  Hitpoints: number;
  Damage: number;
}

// 呪文カード
export interface SpellCard extends BaseCard {
  Damage: number;
  TowerDamage: number;
}

// 攻撃カード
export interface AttackCardType {
  CardKey: string | null;
  Type: "Troop" | "Spell" | null;
  AttackNumber: number;
}

// カードデータ全体の型定義
export interface CardData {
  Troops: {
    [key: string]: TroopCard;
  };
  Spells: {
    [key: string]: SpellCard;
  };
}
