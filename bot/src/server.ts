import * as dotenv from "dotenv";
import Discord from "discord.js";
import * as DeepL from "@/utils/deepl.js";
import * as Config from "@/config.js";

// .envを参照
dotenv.config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
if (DISCORD_TOKEN === undefined) {
	process.exit(-1);
}

const discord = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMessageReactions,
		Discord.GatewayIntentBits.MessageContent
	]
});

// リアクション時の処理
discord.on("messageReactionAdd", async (reaction) => {
	if (reaction.emoji.name !== Config.deeplEmojiName || reaction.message.content === null) {
		return;
	}

	const targetText = reaction.message.content;
	targetText.replace(/`/g, "'");

	const translatedText = await DeepL.translate(targetText);
	translatedText.replace(/`/g, "'");
	await reaction.message.reply("```" + translatedText + "```");
});

// 翻訳準備ができているか判定
const checkTranslateStatus = (guild: Discord.Guild): boolean => {
	let status = false;

	guild.emojis.cache.forEach((emoji) => {
		if (emoji.name === Config.deeplEmojiName) {
			status = true;
		}
	});

	return status;
};

discord.on("ready", () => {
	console.log("SERVER START");

	const joinedDiscordServerList = discord.guilds.cache.map((guild) => guild);

	joinedDiscordServerList.forEach((guild: Discord.Guild) => {
		if (!checkTranslateStatus(guild)) {
			void guild.emojis
				.create({ attachment: "./emoji/deepl.png", name: Config.deeplEmojiName })
				.then((emoji) => {
					console.log(`絵文字を追加しました。`);
				})
				.catch((e) => {
					console.error(e);
					console.error("絵文字が追加できませんでした。なんかしやがったな...！");
				});
		}
	});
});

await discord.login(DISCORD_TOKEN);
