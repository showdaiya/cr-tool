# Next.js / React Learning Log

Next.js と React の学習記録（カテゴリ別）。

---

# 目次

- [React - 基礎概念](#react---基礎概念)
- [React - Hooks](#react---hooks)
- [Next.js - 基礎概念](#nextjs---基礎概念)
- [Next.js - App Router](#nextjs---app-router)
- [Next.js - データフェッチ](#nextjs---データフェッチ)

---

# React - 基礎概念

## コンポーネント

**説明**: UIを構成する再利用可能なパーツ

```tsx
// 関数コンポーネント
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// アロー関数
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>;
};

// 使用
<Greeting name="World" />
```

**命名規則**:
- コンポーネント名はPascalCase（`UserProfile`）
- ファイル名もPascalCase or kebab-case

**学んだ日**: 2026-01-03

---

## Props

**説明**: 親から子に渡すデータ

```tsx
// 型定義
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;  // オプショナル
}

// コンポーネント
function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// children
interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}
```

**学んだ日**: 2026-01-03

---

## State

**説明**: コンポーネント内で管理する状態

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);  // 初期値0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount((prev) => prev - 1)}>-1</button>
    </div>
  );
}
```

**注意点**:
- Stateの更新は非同期
- 前の値を使う場合は関数形式 `setCount(prev => prev + 1)`
- オブジェクトや配列は新しい参照で更新

**学んだ日**: 2026-01-03

---

# React - Hooks

## useState

**説明**: 状態管理のためのHook

```tsx
const [state, setState] = useState<Type>(initialValue);
```

**学んだ日**: 2026-01-03

---

## useEffect

**説明**: 副作用（データフェッチ、DOM操作等）を扱うHook

```tsx
import { useEffect } from "react";

function Component() {
  // マウント時に実行
  useEffect(() => {
    console.log("mounted");
  }, []);

  // 依存配列の値が変わったら実行
  useEffect(() => {
    console.log("count changed:", count);
  }, [count]);

  // クリーンアップ
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    return () => clearInterval(timer);  // アンマウント時に実行
  }, []);
}
```

**依存配列**:
| 依存配列 | 実行タイミング |
|----------|---------------|
| なし | 毎レンダリング |
| `[]` | マウント時のみ |
| `[a, b]` | a または b が変わったとき |

**学んだ日**: 2026-01-03

---

## useMemo / useCallback

**説明**: パフォーマンス最適化のためのHook

```tsx
import { useMemo, useCallback } from "react";

// useMemo: 値のメモ化
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback: 関数のメモ化
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**使いどころ**:
- 重い計算結果のキャッシュ
- 子コンポーネントへの関数渡し（再レンダリング防止）
- 依存配列に関数を入れるとき

**学んだ日**: 2026-01-03

---

## useContext

**説明**: コンポーネントツリー全体でデータを共有

```tsx
import { createContext, useContext } from "react";

// Context作成
const ThemeContext = createContext<"light" | "dark">("light");

// Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

// 使用
function Child() {
  const theme = useContext(ThemeContext);
  return <div>Theme: {theme}</div>;
}
```

**学んだ日**: 2026-01-03

---

# React - UIレイアウト（モバイル優先）

## Tailwindでカード一覧を「スマホで読みやすく」作る
**説明**: スマホ幅では情報量が多いと横並びが崩れやすいので、「常に1カラム」＋「画像左・情報右」の2段構造にすると読みやすい。

**使用例（考え方）**:
```tsx
<div className="flex items-start gap-3">
  <div className="shrink-0">画像</div>
  <div className="min-w-0 flex-1">テキスト（可変幅）</div>
</div>
```

**ポイント**:
- `min-w-0`: flex子要素が縮められずはみ出す問題を防ぐ
- `shrink-0`: 画像やバッジなど「潰したくない要素」を固定する
- `line-clamp-*`: 長いカード名でも行数を固定して見た目を安定させる

**学んだ日**: 2026-01-03

---

## UIの分岐は「表示文字列」に依存させない

**説明**: `modalTitle === "攻撃カードを選択"` のように表示文言で分岐すると、コピー変更や翻訳で壊れる。
分岐用のprops（例: `selectionMode`）を用意して、表示とロジックを分離する。

**使用例（考え方）**:
```tsx
<SelectCardOverlay
  modalTitle="攻撃カードを選択"
  selectionMode="attack"
/>
```

**学んだ日**: 2026-01-04

---

# Next.js - 基礎概念

## Next.jsとは

**説明**: Reactベースのフルスタックフレームワーク

**特徴**:
| 機能 | 説明 |
|------|------|
| ファイルベースルーティング | フォルダ構造 = URL |
| SSR/SSG/ISR | 複数のレンダリング方式 |
| APIルート | バックエンドもNext.jsで |
| 画像最適化 | 自動的に最適化 |
| TypeScriptサポート | 標準対応 |

**学んだ日**: 2026-01-03

---

## レンダリング方式

**説明**: ページの生成タイミング

| 方式 | 説明 | 用途 |
|------|------|------|
| SSG (Static Site Generation) | ビルド時に生成 | ブログ、ドキュメント |
| SSR (Server Side Rendering) | リクエスト時に生成 | ユーザー固有データ |
| ISR (Incremental Static Regeneration) | 定期的に再生成 | 頻繁に更新されるコンテンツ |
| CSR (Client Side Rendering) | ブラウザで生成 | インタラクティブなUI |

**学んだ日**: 2026-01-03

---

## next build の型チェック範囲（tsconfigのexclude）

**説明**: `next build` は「Linting and checking validity of types」でTypeScriptの型チェックも行うため、アプリ本体以外の `.ts`（例: `playwright.config.ts`）が対象に入っていると、CI環境でdevDependenciesが入っていない場合に型エラーで落ちることがある。

**今回の事象**:
- `playwright.config.ts` が型チェック対象に含まれて `Cannot find module '@playwright/test'` で失敗

**対処（最小diff）**: Nextアプリの `tsconfig.json` の `exclude` に、アプリのビルドに不要なファイル/ディレクトリを追加する。

**使用例**:
```json
{
  "exclude": [
    "node_modules",
    "playwright.config.ts",
    "e2e/**"
  ]
}
```

**学んだ日**: 2026-01-03

---

# Next.js - App Router

## ディレクトリ構造

**説明**: App Routerのファイル規約

```
app/
├── layout.tsx      # 共通レイアウト
├── page.tsx        # / (トップページ)
├── loading.tsx     # ローディングUI
├── error.tsx       # エラーUI
├── not-found.tsx   # 404ページ
├── about/
│   └── page.tsx    # /about
└── blog/
    ├── page.tsx    # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug (動的ルート)
```

**特殊ファイル**:
| ファイル | 用途 |
|----------|------|
| `page.tsx` | ルートのUI |
| `layout.tsx` | 共有レイアウト |
| `loading.tsx` | Suspenseのローディング |
| `error.tsx` | エラーバウンダリ |
| `template.tsx` | 再マウントするレイアウト |

**学んだ日**: 2026-01-03

---

## Server Components vs Client Components

**説明**: App Routerの2種類のコンポーネント

| 項目 | Server Component | Client Component |
|------|------------------|------------------|
| デフォルト | ✅ | `"use client"` が必要 |
| Hooks (useState等) | ❌ 使えない | ✅ 使える |
| イベントハンドラ | ❌ 使えない | ✅ 使える |
| async/await | ✅ 使える | ❌ 直接は使えない |
| バンドルサイズ | 含まれない | 含まれる |

```tsx
// Server Component (デフォルト)
async function ServerComponent() {
  const data = await fetch("...");
  return <div>{data}</div>;
}

// Client Component
"use client";
import { useState } from "react";

function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**使い分け**:
- Server: データフェッチ、DB直接アクセス、重いライブラリ
- Client: インタラクティブなUI、ブラウザAPI、Hooks

**学んだ日**: 2026-01-03

---

# Next.js - CSS / Tailwind

## CSS変数でカラーパレットを一元管理

**説明**: Tailwindと組み合わせて、`globals.css`でCSS変数を定義し、全体のカラーパレットを一箇所で管理できる。ダークモード対応も `.dark` クラスで切り替え可能。

**使用例**:
```css
/* globals.css */
:root {
  --primary: 222 47% 11%;       /* HSL値 */
  --primary-foreground: 210 40% 98%;
  --background: 220 30% 98%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --primary: 210 40% 98%;
  --background: 222 47% 11%;
  --border: 217.2 32.6% 17.5%;
}
```

**Tailwind側 (tailwind.config.js)**:
```js
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      background: "hsl(var(--background))",
      border: "hsl(var(--border))",
    },
  },
},
```

**メリット**:
- カラー変更が1箇所で済む
- ダークモード切り替えが容易
- Tailwindのユーティリティと併用可能（`bg-primary`, `text-foreground`等）

**学んだ日**: 2026-01-04

---

## グラデーション vs 単色背景

**説明**: UIのシンプル化でグラデーション背景を単色に変更する際の考え方。

| 観点 | グラデーション | 単色 |
|------|---------------|------|
| 視覚的印象 | リッチ・装飾的 | クリーン・モダン |
| 実装 | `bg-gradient-to-br from-X via-Y to-Z` | `bg-card` |
| 保守性 | 色変更時に複数箇所調整 | 変数1つで済む |
| パフォーマンス | わずかに重い | 軽い |

**変更例**:
```tsx
// Before: グラデーション
<header className="bg-gradient-to-br from-background via-card to-muted/50">

// After: 単色
<header className="bg-card">
```

**学んだ日**: 2026-01-04

---

## ボーダーのアクセント強度を控えめにする

**説明**: `border-accent/60` のような強いアクセントボーダーを `border`（デフォルト）に変更することで、視覚的ノイズを減らせる。

**変更例**:
```tsx
// Before: アクセント強め
<div className="rounded-xl border border-accent/40 bg-card/60 shadow-sm">

// After: シンプル
<div className="rounded-lg border bg-background">
```

**ポイント**:
- `rounded-2xl` → `rounded-xl` や `rounded-lg` で丸みも控えめに
- `shadow-md` → `shadow-sm` でシャドウも軽く
- 装飾を減らすことで「情報」に集中しやすくなる

**学んだ日**: 2026-01-04

---

## Server Componentでのフェッチ

**説明**: asyncコンポーネントで直接フェッチ

```tsx
async function Page() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",  // SSR
    // cache: "force-cache",  // SSG（デフォルト）
    // next: { revalidate: 60 },  // ISR
  });
  const data = await res.json();

  return <div>{data.title}</div>;
}
```

**キャッシュオプション**:
| オプション | 動作 |
|-----------|------|
| `cache: "force-cache"` | SSG（ビルド時に取得） |
| `cache: "no-store"` | SSR（毎回取得） |
| `next: { revalidate: 60 }` | ISR（60秒ごとに再検証） |

**学んだ日**: 2026-01-03

---

## Client Componentでのフェッチ

**説明**: useEffectやSWR/TanStack Queryを使用

```tsx
"use client";
import { useState, useEffect } from "react";

function ClientPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{data.title}</div>;
}
```

**推奨: SWRを使う**:
```tsx
import useSWR from "swr";

function Page() {
  const { data, error, isLoading } = useSWR("/api/data", fetcher);
  // ...
}
```

**学んだ日**: 2026-01-03

---
