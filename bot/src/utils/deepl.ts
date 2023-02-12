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

	const emptyArray: number[] = [];

	const targetTextArray = text.split(/\r?\n/g);
	let replaceTargetTextArray = targetTextArray.map((text, index) => {
		if (text === "") {
			emptyArray.push(index - emptyArray.length);
		}

		return text.replace(/```/g, "<code>");
	});
	replaceTargetTextArray = replaceTargetTextArray.filter((text) => text !== "");

	let errorMessage = "翻訳システムが動作しませんでした。かなりありえない。";
	let translatedText = "";

	const translator = new deepl.Translator(DEEPL_API_KEY);

	try {
		const resultArray = await translator.translateText(replaceTargetTextArray, null, "ja", {
			tagHandling: "xml",
			ignoreTags: "code"
		});

		resultArray.forEach((result, index) => {
			translatedText += result.text;
			if (index !== resultArray.length - 1) {
				translatedText += "\n";
				if (emptyArray.includes(index + 1)) {
					translatedText += "\n";
				}
			}
		});

		translatedText = translatedText.replace(/<code>/g, "```");
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
