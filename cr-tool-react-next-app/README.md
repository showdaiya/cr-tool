# カードバトル計算ツール

このアプリケーションは、カードゲームのダメージ計算をベースにしたシミュレーションツールです。攻撃側カードと防衛側カードの設定を行い、それらの相互作用による計算結果を確認することができます。

## 機能

- 防衛カードの選択と表示
- 攻撃カードの追加、編集、削除
- ダメージ計算と残りHP表示
- ダークモード / ライトモード切り替え
- レスポンシブデザイン

## 技術スタック

- **フレームワーク**: Next.js 15.x + React 19.x
- **言語**: TypeScript
- **UIライブラリ**: Chakra UI
- **状態管理**: React Context API

## 開発環境のセットアップ

```bash
# パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番モードでの起動
npm run start
```

## プロジェクト構成

```
src/
 ├── app/           # Next.js App Router
 ├── components/    # Reactコンポーネント
 ├── context/       # Contextプロバイダー
 ├── data/          # カードデータ
 ├── types/         # TypeScript型定義
 └── utils/         # ユーティリティ関数
```

## 使用方法

1. 防衛カードを選択
2. 攻撃カードを追加
3. 攻撃カードのタイプと攻撃回数を設定
4. 防衛カードの残りHPを確認

## 変更履歴

### 2025-03-30 15:24

- **リファクタリング (コンポーネント統合):**
  - 類似した機能を持つ `SelectDefenceOverlay.tsx` と `SelectAttackOverlay.tsx` を、汎用的な `SelectCardOverlay.tsx` コンポーネントに統合。
  - 同様に、リストアイテムコンポーネント (`DefenceListItem`, `AttackListItem`) を `SelectableCardListItem.tsx` に統合。
  - これによりコードの重複が大幅に削減され、保守性が向上。
  - 古いコンポーネントファイルを削除。

### 2025-03-30 15:15

- **コード品質改善 (カスタムフック):**
  - モーダルが閉じたときに状態をリセットするロジックをカスタムフック `useResetStateOnClose` に抽出し、オーバーレイコンポーネント (`SelectDefenceOverlay`, `SelectAttackOverlay`) で再利用。

### 2025-03-30 15:13

- **バグ修正 (ハイドレーションエラー):**
  - `src/context/ChakraProvider.tsx` にクライアントサイドでのみレンダリングを行うロジック (`isMounted` state, `useEffect`) を元に戻し、ハイドレーションエラーを解消。

### 2025-03-30 15:05

- **コード品質改善 (TypeScript):**
  - `DefenseNotification.tsx` のイベントハンドラーに型 (`React.KeyboardEvent`, `React.MouseEvent`) を追加し、TypeScript の暗黙的な `any` 型エラーを解消。

### 2025-03-30 15:00

- **コード品質改善 (定数化・一貫性):**
  - カード選択オーバーレイのリスト表示遅延時間を `src/constants.ts` に定数として定義 (`OVERLAY_LIST_RENDER_DELAY_MS`)。
  - `SelectDefenceOverlay.tsx` に、モーダルが閉じた際に内部状態をリセットするロジックを追加 (`SelectAttackOverlay.tsx` との一貫性のため)。

### 2025-03-30 14:57

- **安定性向上 (Error Boundary):**
  - `src/components/ErrorBoundary.tsx` を作成し、シンプルな Error Boundary コンポーネントを実装。
  - `src/app/page.tsx` で主要コンポーネント (`CardBattlePage`) を `ErrorBoundary` でラップし、UIの一部でエラーが発生してもアプリケーション全体がクラッシュしないようにした。

### 2025-03-30 14:56

- **依存関係・CSS整理:**
  - `package.json` から未使用の Tailwind CSS 関連の依存関係を削除。
  - `src/app/globals.css` から Chakra UI と重複する可能性のあるスタイルを削除（コメントアウト）。
  - 未使用の CSS モジュール `src/app/page.module.css` を削除。

### 2025-03-30 14:50

- **コード品質改善 (ヘルパー関数の共通化):**
  - カード選択オーバーレイ (`SelectDefenceOverlay`, `SelectAttackOverlay`) で重複していた `getStatValue` ヘルパー関数を `src/utils/cardUtils.ts` に集約。

### 2025-03-30 14:48

- **コード品質改善 (アクセシビリティ・可読性):**
  - `DefenseNotification` コンポーネントに `role="button"` と `tabIndex={0}`、`onKeyDown` ハンドラーを追加し、キーボード操作でのスクロールを可能にした。
  - `CardContext.tsx` の `processCardDatabase` 関数に説明コメントを追加し、可読性を向上させた。

### 2025-03-30 14:45

- **機能改善 (ソート):**
  - カード選択オーバーレイ (`SelectDefenceOverlay`, `SelectAttackOverlay`) に ID によるソート機能を追加。
  - デフォルトのソート順を ID 昇順に変更。

### 2025-03-30 14:38

- **コード品質改善 (定数化・エラーハンドリング):**
  - マジックナンバー（デフォルト防衛カード名、HP閾値）を `src/constants.ts` に定数として定義し、関連コンポーネントで使用するように変更。
  - `CardContext` の初期化時にデータ処理のエラーハンドリング (`try...catch`) を追加。
- **コード品質改善 (型定義):**
  - `src/types/CardTypes.ts` の `Stats` インターフェースに、既知の統計情報キー（`hitpoints`, `damage` など）をオプショナルプロパティとして明示的に追加。これにより、型安全性が向上し、コード補完が利用しやすくなった（未知のキーに対応するためのインデックスシグネチャは維持）。
- **リファクタリング (オーバーレイ):**
  - `SelectAttackOverlay` のソートキーから不要な `"Default"` 値を削除し、初期値を `"JpName"` に変更。

### 2025-03-30 14:18

- **パフォーマンス改善 (Context):**
  - `CardContext` 内で `totalDamage` と `remainingHP` の計算結果を `useMemo` でメモ化。
  - Context から計算関数ではなく計算済みの値を提供するように変更し、関連コンポーネント (`DefenceCard`, `DefenseNotification`) の不要な再レンダリングを抑制。
- **コード品質改善 (可読性・型安全性):**
  - `CardBattlePage.tsx` の JSX を複数の内部コンポーネント (`PageHeader`, `ActionButtons`, `InfoBox`, `PageFooter`) に分割し、可読性を向上。
  - `CardContext.tsx` の `processCardDatabase` 関数内の型アサーションを減らし、型安全性を向上。

### 2025-03-30 13:48

- **コード品質改善 (ヘルパー関数の共通化):**
  - ユーティリティファイル `src/utils/cardUtils.ts` を作成。
  - 複数のコンポーネント (`CardContext.tsx`, `DefenceCard.tsx`, `AttackCard.tsx`, `DefenseNotification.tsx`) で重複していたヘルパー関数 (`parseDamage`, `getInitialHp`, `getCardImageFilename` など) を `cardUtils.ts` に集約。
  - 各コンポーネントから重複定義を削除し、ユーティリティ関数をインポートするように修正。

### 2025-03-30 13:18

- **パフォーマンス改善:**
  - `AttackCard` および `DefenceCard` コンポーネントに `React.memo` を適用し、不要な再レンダリングを抑制。
  - 状態リセットロジックを改善し、ページリロードではなく Context 内で効率的に状態をリセットするように変更 (`resetState` 関数の導入)。
  - `CardBattlePage` の `IntersectionObserver` ロジックを簡略化し、不要な `useEffect` を削除。

### 2025-03-30 12:45

- **状態管理の変更:**
  - ローカルストレージによる状態の永続化を廃止。
  - ページリロード時に状態がリセットされるように変更 (`src/context/CardContext.tsx`)。

### 2025-03-30 12:34

- **攻撃カード選択オーバーレイの簡略化:**
  - `SelectAttackOverlay.tsx` から、不要になったダメージタイプ選択プルダウンと関連ロジック（state, props, 関数呼び出し）を削除。
  - `AttackCard` コンポーネントで全てのダメージタイプが表示・編集されるようになったため、オーバーレイでの事前選択が不要になった。

### 2025-03-30 12:12

- **攻撃カードのダメージ表示修正:**
  - `AttackCard.tsx` を修正し、カードが持つ複数のダメージタイプ（例: 範囲ダメージ、召喚ダメージ）を縦に並べて表示するように変更。
  - 各ダメージタイプに対して、個別の攻撃回数を設定できる `NumberInput` を追加。
- **関連コンポーネントと型の更新:**
  - `src/types/CardTypes.ts` の `AttackCardState` 型定義を変更し、単一の `selectedDamageKey` と `attackNumber` の代わりに、ダメージキーと攻撃回数をマッピングする `attackNumbers` オブジェクトを使用するように更新。
  - `src/context/CardContext.tsx` の `calculateTotalDamage` 関数を修正し、新しい `attackNumbers` 構造に対応。また、`attackNumbers` が `undefined` や `null` の場合にエラーが発生しないようにチェック処理を追加。
  - `src/components/SelectAttackOverlay.tsx` の `handleConfirm` 関数を修正し、新しい `attackNumbers` 構造で `AttackCardState` を正しく作成するように更新。

### 2025-03-29 16:54

- **攻撃カード編集機能の追加:**
  - `AttackCard.tsx` に「編集」ボタンを追加。
  - 編集ボタンと削除ボタンをアイコンボタン (`IconButton`) からテキスト付きボタン (`Button`) に変更（ラベル: "編集", "削除"）。
  - `AttackCardSection.tsx` に編集ロジックを実装:
    - 編集ボタンクリック時にカード選択オーバーレイを開く (`handleEditCard`)。
    - オーバーレイで選択されたカード情報で既存のカードを更新 (`handleSelectCard`, `updateAttackCard`)。

### 2025-03-29 16:41

- **オーバーレイパフォーマンス改善:**
  - カード選択オーバーレイ (`SelectDefenceOverlay.tsx`, `SelectAttackOverlay.tsx`) の初回表示パフォーマンスを改善。
  - リスト項目コンポーネント (`DefenceListItem`, `AttackListItem`) に `React.memo` を適用し、不要な再レンダリングを抑制。
  - リスト本体のレンダリングを遅延させることで、モーダル表示の体感速度を向上 (`useState`, `useEffect`, `setTimeout` を使用)。
  - リスト準備中にローディングスピナー (`Spinner`) を表示。
  - `SelectAttackOverlay.tsx` の呪文タブでリスト表示に関する不具合を修正。

### 2025-03-29 14:02

- **オーバーレイUIの調整:**
  - 攻撃カード選択オーバーレイ (`SelectAttackOverlay.tsx`) および防衛カード選択オーバーレイ (`SelectDefenceOverlay.tsx`) からカード画像表示を削除。
  - 上記に伴い、関連する未使用のインポート (`Image`) とヘルパー関数 (`getCardImageFilename`, `formatCardId`) を削除。

### 2025-03-29 13:36

- **防衛カード通知の修正:**
  - `CardBattlePage.tsx` において、防衛カードセクションが画面外にスクロールされた際に表示される通知が、初回ページ読み込み時に正しく表示されない問題を修正。
  - `IntersectionObserver` の初期設定を行う `useEffect` の実行タイミングを調整し、コンポーネントのマウントと参照要素 (`defenseCardRef`) の準備が完了してから監視を開始するように変更。

### 2025-03-29 13:13

- **防衛カードUI調整:**
  - `DefenceCard.tsx` のレイアウト、画像サイズ、文字サイズ、パディング、ボーダーを `AttackCard.tsx` と同様のスタイルに統一。
  - `DefenceCard.tsx` の外側の `Box` コンポーネントから不要なパディング (`p={4}`) を削除。
  - 関連する ESLint エラー（`Tooltip`, `Flex` のインポート漏れ、`shadow` プロパティの重複）を修正。

### 2025-03-29 12:54

- **画像表示の追加と修正:**
  - 攻撃カード選択オーバーレイ (`SelectAttackOverlay.tsx`) の全タブにカード画像を表示。
  - ホーム画面の防衛カード表示 (`DefenceCard.tsx`) に画像を表示。
  - リストアイテムの `key` プロパティを更新し、React の警告を解消。
- **画像ファイル名の統一:**
  - `public/resized_cards/` 内のファイル名に含まれるドット (`.`) と空白 (` `) をアンダースコア (`_`) に置換する Python スクリプト (`python/fommated_image_filenames.py`) を作成・実行。
  - 各コンポーネントの画像ファイル名生成ロジック (`getCardImageFilename`) を上記ルールに統一。
- **プレースホルダー画像エラーの解消:**
  - 存在しない代替画像 (`placeholder.png`) への参照 (`fallbackSrc`) を関連コンポーネントから削除し、404 エラーを解消。

### 2025-03-29 11:37

- CardData.jsonにid列の追加
- 画像情報から取得

### 2025-03-29 10:58

- 並び替えの方法からデフォルトを削除、日本語名、英語名を追加

### 2025-03-29 10:53

- オーバーレイにattack, defenceのbooleanの結果を反映

### 2025-03-29 10:41

- UIのカードのダメージを与える項目を英語から日本語へ変更
- Costという文字をエリクサーに変更
- カードデータにboolean型のattack, defence項目を追加 -> 次の修正で選択オーバーレイに表示の可否を変更する

### 2025-03-29 09:42

- カード種類追加に伴う全体的な修正
- 不要なディレクトリをgitから削除

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
