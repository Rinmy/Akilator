import * as dotenv from "dotenv";
import Discord from "discord.js";
import * as DeepL from "@/utils/deepl.js";
import * as Validation from "@/utils/validation.js";
import * as Config from "@/config.js";

// .envを参照
dotenv.config();
const DISCORD_TOKEN = process.env.MODE === "dev" ? process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN;
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

	if (reaction.message.author === null) {
		Validation.message("A1");
		return;
	}

	const author = reaction.message.author.username;
	const userId = reaction.message.author.id;
	const avatarId = reaction.message.author.avatar;

	if (avatarId === null) {
		Validation.message("A2");
		return;
	}

	let targetText = reaction.message.content;
	targetText = targetText.replace(/```/g, "<code>");

	let translatedText = await DeepL.translate(targetText);
	translatedText = translatedText.replace(/<code>/g, "```");

	const translatedEmbed = new Discord.EmbedBuilder()
		.setColor(0x0099ff)
		.setAuthor({
			name: author,
			iconURL: `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.webp`,
			url: "https://www.deepl.com/ja/translator"
		})
		.setFooter({ text: "translated by DeepL", iconURL: "attachment://deepl.png" })
		.setDescription(translatedText);
	await reaction.message.reply({ embeds: [translatedEmbed], files: ["./emoji/deepl.png"] });
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
	console.log(process.env.MODE === "dev" ? "DEV BOT START" : "BOT START");

	const joinedDiscordServerList = discord.guilds.cache.map((guild) => guild);

	joinedDiscordServerList.forEach((guild: Discord.Guild) => {
		if (!checkTranslateStatus(guild)) {
			void guild.emojis
				.create({ attachment: "./emoji/deepl.png", name: Config.deeplEmojiName })
				.then((emoji) => {
					console.log(`絵文字を追加しました。`);
				})
				.catch((e: Discord.DiscordAPIError) => {
					let errorCode = e.code;
					if (typeof errorCode === "number") {
						errorCode = `D${errorCode}`;
					} else {
						errorCode = "0";
					}
					console.log(Validation.message(errorCode));
					console.error("絵文字が追加できませんでした。なんかしやがったな...！");
				});
		}
	});
});

await discord.login(DISCORD_TOKEN);
