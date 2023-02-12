import * as dotenv from "dotenv";
import * as deepl from "deepl-node";

// .env参照
dotenv.config();

export const translate = async (text: string): Promise<string> => {
	const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
	if (DEEPL_API_KEY === undefined) {
		return "error";
	}

	if (text === "") {
		return "メッセージが見つかりませんでした。虚空に伝えるな！";
	}

	if (DEEPL_API_KEY === "") {
		return "APIキーがありません。これがオートロックの罠!?";
	}

	let errorMessage = "翻訳システムが動作しませんでした。かなりありえない。";
	let translatedText = "";

	const translator = new deepl.Translator(DEEPL_API_KEY);

	try {
		const result = await translator.translateText(text, null, "ja", {
			ignoreTags: "`"
		});
		translatedText = result.text;
	} catch (e) {
		console.error(e);
		errorMessage = "何かしらのエラーが発生しました。困ったエラーですこれ。";
		translatedText = errorMessage;
	} finally {
		if (translatedText === "") {
			translatedText = errorMessage;
		}
	}

	return translatedText;
};
