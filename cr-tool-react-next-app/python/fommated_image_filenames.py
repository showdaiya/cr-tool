import os
import sys

# 画像ファイルが格納されているディレクトリへのパス (プロジェクトルートからの相対パス)
IMAGE_DIR = "public/resized_cards"

def rename_files_in_directory(directory):
    """
    指定されたディレクトリ内の画像ファイル名を一括で変更する。
    変更ルール:
    - ファイル名（拡張子を除く）の '.' を '_' に置換
    - ファイル名（拡張子を除く）の ' ' を '_' に置換
    """
    print(f"Processing files in directory: {directory}")
    renamed_count = 0
    skipped_count = 0
    error_count = 0

    try:
        # ディレクトリが存在するか確認
        if not os.path.isdir(directory):
            print(f"Error: Directory not found at '{directory}'")
            print("Please ensure the script is run from the project root directory.")
            sys.exit(1) # エラーで終了

        print("Scanning files...")
        all_files = os.listdir(directory)
        print(f"Found {len(all_files)} items in the directory.")

        for filename in all_files:
            current_filepath = os.path.join(directory, filename)

            # ファイルのみを対象とする (サブディレクトリは無視)
            if os.path.isfile(current_filepath):
                # ファイル名を名前と拡張子に分割
                name_part, ext_part = os.path.splitext(filename)

                # 拡張子が .png のファイルのみを対象とする (大文字小文字を区別しない)
                if ext_part.lower() == ".png":
                    # 新しいファイル名を生成 (名前部分のみ置換)
                    new_name_part = name_part.replace(".", "_").replace(" ", "_")

                    # ファイル名が変更された場合のみリネーム処理を行う
                    if new_name_part != name_part:
                        new_filename = new_name_part + ext_part
                        new_filepath = os.path.join(directory, new_filename)

                        # 新しいファイル名が既に存在しないか確認 (念のため)
                        if not os.path.exists(new_filepath):
                            try:
                                os.rename(current_filepath, new_filepath)
                                print(f"  Renamed: '{filename}' -> '{new_filename}'")
                                renamed_count += 1
                            except OSError as e:
                                print(f"  Error renaming '{filename}': {e}")
                                error_count += 1
                                skipped_count += 1 # エラーもスキップとしてカウント
                        else:
                            print(f"  Skipped renaming '{filename}': Target '{new_filename}' already exists.")
                            skipped_count += 1
                    else:
                        # ファイル名に変更がない場合はスキップ
                        # print(f"  Skipped: '{filename}' (no changes needed)")
                        skipped_count += 1
                else:
                    # .png 以外のファイルはスキップ
                    # print(f"  Skipped: '{filename}' (not a .png file)")
                    skipped_count += 1
            else:
                 # ファイルでないものはスキップ
                 # print(f"  Skipped: '{filename}' (not a file)")
                 skipped_count += 1

    except FileNotFoundError:
        print(f"Error: Directory not found at '{directory}' during listing.")
        print("Please ensure the script is run from the project root directory.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1) # エラーで終了

    print("\n--- Renaming Summary ---")
    print(f"Successfully renamed: {renamed_count} files")
    print(f"Skipped (no changes needed, not a PNG, or target exists): {skipped_count}")
    print(f"Errors during renaming: {error_count}")
    print("------------------------")

if __name__ == "__main__":
    # スクリプトが直接実行された場合に処理を開始
    # プロジェクトルートからの相対パスでディレクトリを指定
    target_dir = os.path.join(os.getcwd(), IMAGE_DIR)
    # os.path.abspath を使って絶対パスに変換するとより確実
    # target_dir = os.path.abspath(IMAGE_DIR)
    rename_files_in_directory(IMAGE_DIR) # プロジェクトルートからの相対パスを渡す