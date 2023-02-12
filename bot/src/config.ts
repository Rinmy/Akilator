import * as dotenv from "dotenv";

// .envを参照
dotenv.config();

export const deeplEmojiName = process.env.MODE === "dev" ? "akilator_deepl_dev" : "akilator_deepl";
