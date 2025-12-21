# コーディング規約

このドキュメントは、クラロワダメージ計算ツールの開発におけるコーディング規約を定義します。

## 1. TypeScript

### 1.1 型定義

```typescript
// ✅ Good: 明示的な型定義
interface CardProps {
  id: number;
  name: string;
  damage: number;
}

// ❌ Bad: any型の使用
const processCard = (card: any) => { ... }

// ✅ Good: unknown + 型ガード
const processCard = (card: unknown): CardProps | null => {
  if (isCardProps(card)) {
    return card;
  }
  return null;
}
```

### 1.2 型 vs インターフェース

```typescript
// インターフェース: オブジェクトの形状を定義する場合
interface CardContextType {
  allCards: AnyCard[];
  attackCards: AttackCardState[];
}

// 型エイリアス: ユニオン型、交差型、プリミティブ型の別名
type CardType = "Troop" | "Building" | "Spell";
type AnyCard = NormalTroopCard | NormalBuildingCard | NormalSpellCard;
```

### 1.3 Null/Undefined ハンドリング

```typescript
// ✅ Good: オプショナルチェーン + Nullish Coalescing
const damage = card?.stats?.damage ?? 0;

// ❌ Bad: 論理OR（0やfalseが有効値の場合に問題）
const damage = card && card.stats && card.stats.damage || 0;
```

## 2. React / Next.js

### 2.1 コンポーネント命名

```
src/components/
├── AttackCard.tsx           # PascalCase
├── DefenceCard.tsx
├── CardBattlePage.tsx
└── SelectCardOverlay.tsx
```

- **ファイル名**: PascalCase（コンポーネント名と一致）
- **コンポーネント名**: PascalCase
- **関数名・変数名**: camelCase

### 2.2 コンポーネント構造

```typescript
// 1. インポート（外部 → 内部の順）
import { useState, useEffect } from "react";           // React
import { Box, Button } from "@chakra-ui/react";        // 外部ライブラリ
import { useCardContext } from "@/context/CardContext"; // 内部モジュール
import { CardProps } from "@/types/CardTypes";          // 型定義

// 2. 型定義（コンポーネント固有）
interface ComponentProps {
  onSelect: (card: AnyCard) => void;
}

// 3. 内部サブコンポーネント（必要に応じて）
const InternalHeader = () => <Box>...</Box>;

// 4. メインコンポーネント
const MyComponent = ({ onSelect }: ComponentProps) => {
  // 4a. Hooks（useState, useEffect, useContext, etc.）
  const [state, setState] = useState<string>("");
  const { allCards } = useCardContext();

  // 4b. コールバック関数
  const handleClick = useCallback(() => {
    // ...
  }, []);

  // 4c. 副作用
  useEffect(() => {
    // ...
  }, []);

  // 4d. 早期リターン（ローディング、エラー等）
  if (!allCards.length) return null;

  // 4e. レンダリング
  return (
    <Box>
      <InternalHeader />
      {/* ... */}
    </Box>
  );
};

// 5. エクスポート
export default MyComponent;
```

### 2.3 Hooks のルール

```typescript
// ✅ Good: カスタムフックで共通ロジックを抽出
const useCardSelection = (initialCard: AnyCard | null) => {
  const [selected, setSelected] = useState(initialCard);
  // ...
  return { selected, setSelected };
};

// ✅ Good: useMemo/useCallback で不要な再計算を防ぐ
const totalDamage = useMemo(() => {
  return attackCards.reduce((sum, card) => sum + card.damage, 0);
}, [attackCards]);

// ❌ Bad: 依存配列の省略・不正確な指定
useEffect(() => {
  fetchData(cardId); // cardIdが依存配列にない
}, []);
```

### 2.4 Server/Client Component

```typescript
// Client Component（インタラクティブ機能が必要な場合）
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Server Component（データフェッチ、静的表示の場合）
// "use client" ディレクティブなし
export default async function StaticComponent() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

## 3. スタイリング（Chakra UI）

### 3.1 基本方針

- **Chakra UI のコンポーネントを優先使用**
- **インラインスタイルはpropsで指定**
- **カスタムCSSは最小限に**

```typescript
// ✅ Good: Chakra UIのprops
<Box
  p={4}
  bg="gray.100"
  borderRadius="md"
  _hover={{ bg: "gray.200" }}
>
  Content
</Box>

// ❌ Bad: インラインstyle属性
<div style={{ padding: "16px", backgroundColor: "#f0f0f0" }}>
  Content
</div>
```

### 3.2 レスポンシブデザイン

```typescript
// Chakraのレスポンシブ配列記法
<Box
  fontSize={{ base: "sm", md: "md", lg: "lg" }}
  p={{ base: 2, md: 4 }}
  display={{ base: "block", md: "flex" }}
>
  Responsive Content
</Box>
```

### 3.3 カラーモード

```typescript
// useColorModeValue でライト/ダーク対応
import { useColorModeValue } from "@chakra-ui/react";

const Component = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box bg={bgColor} color={textColor}>
      Content
    </Box>
  );
};
```

## 4. 状態管理

### 4.1 Context API の使用方針

```typescript
// ✅ Good: 関連する状態をまとめてContextで管理
interface CardContextType {
  allCards: AnyCard[];
  attackCards: AttackCardState[];
  defenceCard: AnyCard | null;
  // Actions
  addAttackCard: (card: AttackCardState) => void;
  removeAttackCard: (index: number) => void;
}

// ❌ Bad: 無関係な状態を1つのContextに混在
interface BadContextType {
  cards: AnyCard[];
  userSettings: UserSettings;  // 別のContextに分離すべき
  theme: Theme;                // 別のContextに分離すべき
}
```

### 4.2 ローカルステート vs Context

| 状態の種類 | 管理場所 |
|-----------|---------|
| フォーム入力値 | ローカルステート |
| モーダル開閉 | ローカルステート |
| 選択中のカード（グローバル） | Context |
| 計算結果（複数コンポーネントで使用） | Context |

## 5. エラーハンドリング

### 5.1 Error Boundary

```typescript
// コンポーネントレベルでエラーをキャッチ
<ErrorBoundary fallback={<ErrorFallback />}>
  <CardBattlePage />
</ErrorBoundary>
```

### 5.2 try-catch

```typescript
// 非同期処理のエラーハンドリング
const fetchCardData = async () => {
  try {
    const data = await fetch("/api/cards");
    return await data.json();
  } catch (error) {
    console.error("Failed to fetch card data:", error);
    return [];
  }
};
```

## 6. 命名規則

### 6.1 変数・関数

| 種類 | 規則 | 例 |
|-----|------|-----|
| 変数 | camelCase | `cardData`, `attackCount` |
| 定数 | SCREAMING_SNAKE_CASE | `DEFAULT_DEFENCE_CARD_NAME` |
| 関数 | camelCase（動詞で開始） | `getCardById`, `calculateDamage` |
| イベントハンドラ | handle + イベント名 | `handleClick`, `handleSelect` |
| 真偽値 | is/has/can + 形容詞 | `isLoading`, `hasError`, `canEdit` |

### 6.2 ファイル・ディレクトリ

| 種類 | 規則 | 例 |
|-----|------|-----|
| コンポーネント | PascalCase | `AttackCard.tsx` |
| フック | camelCase（useで開始） | `useCardContext.ts` |
| ユーティリティ | camelCase | `cardUtils.ts` |
| 型定義 | PascalCase | `CardTypes.ts` |
| 定数 | camelCase | `constants.ts` |

## 7. コメント

### 7.1 基本方針

- **自明なコードにはコメント不要**
- **なぜそうしたか（Why）を説明**
- **複雑なロジックには説明を追加**

```typescript
// ✅ Good: 理由を説明
// DPSは計算済みのため、ダメージオプションから除外
if (lowerKey.includes("dps") || lowerKey.includes("damage_per_second")) {
  continue;
}

// ❌ Bad: 自明なことを説明
// iを1増やす
i++;
```

### 7.2 JSDoc

```typescript
/**
 * カードIDからカードオブジェクトを検索する
 * @param id - カードの一意識別子
 * @returns 見つかったカード、または undefined
 */
const findCardById = (id: number): AnyCard | undefined => {
  return allCards.find((card) => card.id === id);
};
```

## 8. Git コミット

### 8.1 コミットメッセージ形式

```
<type>: <subject>

[body]

[footer]
```

### 8.2 Type 一覧

| Type | 説明 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（機能変更なし） |
| `docs` | ドキュメント変更 |
| `style` | コードスタイル変更（動作に影響なし） |
| `perf` | パフォーマンス改善 |
| `test` | テスト追加・修正 |
| `chore` | ビルド、CI等の設定変更 |

### 8.3 例

```
feat: 攻撃カードの編集機能を追加

- 攻撃カード一覧に編集ボタンを追加
- 編集時にオーバーレイを再表示する機能を実装
- updateAttackCard関数をContextに追加

Closes #42
```

## 9. パフォーマンス

### 9.1 メモ化

```typescript
// React.memo: propsが変わらない限り再レンダリングしない
const AttackCard = React.memo(({ card, onEdit, onRemove }: Props) => {
  // ...
});

// useMemo: 計算結果をキャッシュ
const totalDamage = useMemo(() => {
  return attackCards.reduce((sum, card) => sum + calculateDamage(card), 0);
}, [attackCards]);

// useCallback: 関数をキャッシュ
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 9.2 遅延ロード

```typescript
// 動的インポートでコード分割
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Spinner />,
});
```

---

## 10. チェックリスト

### コミット前

- [ ] `npm run lint` でエラーなし
- [ ] `npm run build` が成功
- [ ] 型エラーなし
- [ ] 不要なconsole.logを削除
- [ ] 意味のあるコミットメッセージを記載

### コードレビュー観点

- [ ] 型安全性が確保されているか
- [ ] パフォーマンスに問題はないか
- [ ] 可読性は十分か
- [ ] 再利用可能な設計か
- [ ] アクセシビリティは考慮されているか

---

**最終更新**: 2025-12-21
