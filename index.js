require("dotenv").config();

/**
 * Constante d'initialisation
 */
const {Client, GatewayIntentBits} = require("discord.js");

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


const commande = require("./commande.js");
bot.commande = {};
bot.commande["sondage"] = commande["sondage"];
bot.commande["sondage_rdva"] = commande["sondage_rdva"];

bot.on("ready", async () => await require("./evenement/ready.js")(bot));
bot.on("interactionCreate", async (interaction) => await require("./evenement/interactionCreate.js")(bot, interaction));
bot.on("messageCreate", async (message) => await require("./evenement/messageCreate.js")(message));


/**
 * Connection du bot
 */
bot.login(process.env.BOT_TOKEN);

