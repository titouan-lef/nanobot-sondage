import { Client } from "discord.js";
import "dotenv/config";
import mongo from "mongoose";
import tabCommande from "../commande"

export default async (bot: Client): Promise<void> => {
    for (const [, commande] of Object.entries(tabCommande))
        bot.application?.commands.create(commande());
    
    await mongo.connect(<string>process.env.MONGO, { keepAlive: true });

    console.log("bot ok");
};