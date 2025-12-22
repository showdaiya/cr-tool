/**
 * デフォルトで選択される防衛カードの英語名
 */
export const DEFAULT_DEFENCE_CARD_NAME = "Knight";

/**
 * HP表示の色が変わる閾値 (割合)
 * LOW_HP_THRESHOLD以下: 赤色
 * MEDIUM_HP_THRESHOLD以下: 黄色
 * それより上: 緑色
 */
export const LOW_HP_THRESHOLD = 0.2;
export const MEDIUM_HP_THRESHOLD = 0.5;

/**
 * カード選択オーバーレイでリスト表示を遅延させる時間 (ミリ秒)
 * 体感的な表示速度を向上させるため
 */
export const OVERLAY_LIST_RENDER_DELAY_MS = 50;

/**
 * カード選択ダイアログの最大高さ (ビューポート高さに対する割合)
 * モバイルデバイスでボタンが収まるように90%に設定
 */
export const CARD_DIALOG_MAX_HEIGHT = "90vh";