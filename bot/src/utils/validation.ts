export const message = (code: string): string => {
	switch (code) {
		case "0":
			return "予期しつつ予期せぬエラーが発生しました。";

		case "A1":
			return "ユーザー情報が取得できませんでした。匿名さんいらっしゃいっ旦";

		case "A2":
			return "アバターIDが取得できませんでした。君写真と違くない？";

		case "D50013":
			return "権限が不足しています。管理者権限でも良いんですよw";

		default:
			return "ガチ予期せぬエラーが発生しました。";
	}
};
