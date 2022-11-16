import "dotenv/config";
import { Client, GatewayIntentBits, Interaction, Message } from "discord.js";

import ready from "./evenement/ready";
import interactionCreate from "./evenement/interactionCreate";
import messageCreate from "./evenement/messageCreate";

const bot: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

bot.on("ready", async (): Promise<void> => { await ready(bot); });
bot.on("interactionCreate", async (interaction: Interaction): Promise<void> => { await interactionCreate(interaction); });
bot.on("messageCreate", async (message: Message): Promise<void> => { await messageCreate(message); });

/**
 * Connection du bot
 */
bot.login(process.env.BOT_TOKEN);

