require("dotenv").config();
const mongo = require("mongoose");

module.exports = (bot) => {
    for (const [key] of Object.entries(bot.commande))
        bot.application.commands.create(bot.commande[key]());
    
    mongo.connect(process.env.MONGO, { keepAlive: true });

    console.log("bot ok");
};