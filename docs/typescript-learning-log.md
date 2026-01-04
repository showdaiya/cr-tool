# TypeScript Learning Log

TypeScript の学習記録（カテゴリ別）。

---

# 目次

- [TypeScript - 基礎概念](#typescript---基礎概念)
- [型定義](#型定義)
- [ジェネリクス](#ジェネリクス)
- [ユーティリティ型](#ユーティリティ型)
- [型ガード](#型ガード)

---

# TypeScript - 基礎概念

## TypeScriptとは

**説明**: JavaScriptに静的型付けを追加した言語

**メリット**:
- コンパイル時にエラー検出
- エディタの補完が強力
- リファクタリングが安全
- ドキュメントとしての役割

**JavaScriptとの関係**:
```
TypeScript (.ts) → コンパイル → JavaScript (.js)
```

**学んだ日**: 2026-01-03

---

## tsconfigの `include` / `exclude`

**説明**: TypeScriptが型チェック対象にするファイルを制御する設定。Next.jsの `next build` の型チェックでも、この範囲設定が効く。

**ポイント**:
- E2Eやツール設定（例: `playwright.config.ts`）をNextアプリの型チェックに含めたくない場合は `exclude` に入れる
- CIでdevDependenciesが入らない/最小インストールの場合、ツール用依存が見つからず型エラーになりやすい

**使用例**:
```json
{
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "playwright.config.ts", "e2e/**"]
}
```

**学んだ日**: 2026-01-03

---

## 基本の型

**説明**: TypeScriptの基本的な型

```typescript
// プリミティブ型
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let n: null = null;
let u: undefined = undefined;

// 配列
let arr: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];

// オブジェクト
let obj: { name: string; age: number } = { name: "John", age: 30 };

// any（使用を避ける）
let anything: any = "dangerous";

// unknown（anyより安全）
let unknown: unknown = "safe";
```

**学んだ日**: 2026-01-03

---

# 型定義

## type vs interface

**説明**: オブジェクトの型を定義する2つの方法

```typescript
// type（型エイリアス）
type User = {
  name: string;
  age: number;
};

// interface
interface User {
  name: string;
  age: number;
}
```

**違い**:
| 項目 | type | interface |
|------|------|-----------|
| 拡張 | `&`（インターセクション） | `extends` |
| 宣言マージ | ❌ 不可 | ✅ 可能 |
| プリミティブ | ✅ 可能 | ❌ 不可 |
| ユニオン | ✅ 可能 | ❌ 不可 |

**使い分けの目安**:
- オブジェクトの形を定義 → `interface`
- ユニオン型、複雑な型 → `type`
- ライブラリ公開 → `interface`（拡張可能）

**学んだ日**: 2026-01-03

---

## Union型とIntersection型

**説明**: 型を組み合わせる方法

```typescript
// Union型（いずれか）
type Status = "loading" | "success" | "error";
type StringOrNumber = string | number;

// Intersection型（すべて満たす）
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // { name: string; age: number }
```

**学んだ日**: 2026-01-03

---

## リテラル型

**説明**: 特定の値のみを許可する型

```typescript
// 文字列リテラル型
type Direction = "up" | "down" | "left" | "right";

// 数値リテラル型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// as const（読み取り専用リテラル型）
const config = {
  endpoint: "https://api.example.com",
  timeout: 5000,
} as const;
```

**学んだ日**: 2026-01-03

---

## 文字列リテラルユニオンで「モード」を表す

**説明**: UIの分岐を「画面表示の文言（例: モーダルタイトル）」に依存させると、文言変更でロジックが壊れる。
`"attack" | "defence"` のような文字列リテラルユニオンをpropsにすると、安全に分岐できる。

**使用例**:
```ts
type SelectionMode = "attack" | "defence";

type Props = {
  selectionMode: SelectionMode;
};

if (selectionMode === "attack") {
  // 攻撃カード用
} else {
  // 防衛カード用
}
```

**関連（なぜ安全？）**:
- 許容値が型で固定される（タイポや想定外の値をコンパイル時に検知）
- 表示文言の変更とロジックが分離できる

**学んだ日**: 2026-01-04

---

# ジェネリクス

## 基本

**説明**: 型をパラメータ化して再利用可能にする

```typescript
// ジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("hello"); // 明示的
identity(42);              // 推論される

// ジェネリック型
type Box<T> = {
  value: T;
};

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };
```

**学んだ日**: 2026-01-03

---

## 制約（extends）

**説明**: ジェネリクスに制約を付ける

```typescript
// Tはlengthプロパティを持つ必要がある
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hello");     // OK: stringはlengthを持つ
getLength([1, 2, 3]);   // OK: 配列はlengthを持つ
getLength(123);         // ❌ エラー: numberはlengthを持たない
```

**学んだ日**: 2026-01-03

---

# ユーティリティ型

## よく使うユーティリティ型

**説明**: TypeScript組み込みの便利な型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Partial: すべてオプショナルに
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required: すべて必須に
type RequiredUser = Required<PartialUser>;

// Pick: 一部だけ抽出
type UserName = Pick<User, "name">;
// { name: string; }

// Omit: 一部を除外
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; }

// Record: キーと値の型を指定
type UserMap = Record<string, User>;
// { [key: string]: User }

// Readonly: 読み取り専用に
type ReadonlyUser = Readonly<User>;
```

**学んだ日**: 2026-01-03

---

## ReturnType / Parameters

**説明**: 関数から型を抽出

```typescript
function createUser(name: string, age: number): User {
  return { id: 1, name, email: "" };
}

// 関数の戻り値の型を取得
type CreateUserReturn = ReturnType<typeof createUser>;
// User

// 関数のパラメータの型を取得
type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
```

**学んだ日**: 2026-01-03

---

# 型ガード

## typeof / instanceof

**説明**: 型を絞り込む方法

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // ここでは value は string
    console.log(value.toUpperCase());
  } else {
    // ここでは value は number
    console.log(value.toFixed(2));
  }
}

class Dog { bark() {} }
class Cat { meow() {} }

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

**学んだ日**: 2026-01-03

---

## in演算子 / カスタム型ガード

**説明**: プロパティの存在で型を絞り込む

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

// in演算子
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// カスタム型ガード
function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}

function move2(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

**学んだ日**: 2026-01-03

---
