import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { type DeeplResponseType } from "@/interface.js";

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

	const API_URL = `https://api-free.deepl.com/v2/translate?auth_key=${DEEPL_API_KEY}&text=${text}&target_lang=JA`;

	try {
		const res = await fetch(API_URL);
		if (!res.ok) {
			throw new Error(`${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as DeeplResponseType;
		translatedText = data.translations[0].text;
		if (translatedText === "") {
			translatedText = "🤔";
		}
	} catch (e) {
		console.error(e);
		errorMessage = "何かしらのエラーが発生しました。困ったエラーですこれ。";
	} finally {
		if (translatedText === "") {
			translatedText = errorMessage;
		}
	}

	return translatedText;
};
