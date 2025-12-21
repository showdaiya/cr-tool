import { useEffect } from "react";

/**
 * モーダルやオーバーレイが閉じた（isOpenがfalseになった）ときに、
 * 指定されたリセット関数を実行するカスタムフック。
 *
 * @param isOpen モーダル/オーバーレイの開閉状態を示すboolean値。
 * @param resetFunction isOpenがfalseになったときに呼び出すリセット関数。
 */
const useResetStateOnClose = (isOpen: boolean, resetFunction: () => void) => {
  useEffect(() => {
    if (!isOpen) {
      resetFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // resetFunction は通常メモ化されている想定なので依存配列から除外
};

export default useResetStateOnClose;