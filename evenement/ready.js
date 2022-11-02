require("dotenv").config();
const mongo = require("mongoose");

module.exports = async (bot) => {
    for (const [key] of Object.entries(bot.commande))
        bot.application.commands.create(bot.commande[key]());
    
    await mongo.connect(process.env.MONGO, { keepAlive: true });

    console.log("bot ok");
};