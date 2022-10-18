module.exports = (bot, inter) => {
    if (inter.channel.permissionsFor(process.env.BOT_ID).has("VIEW_CHANNEL"))
    {
        if (inter.isCommand() && inter.commandName in bot.commande)
            require("../interaction/sondage.js")(inter);
    }
    else
        console.log("Le bot n'a pas accès au channel");

    if (inter.isButton())
        require("../interaction/bouton.js")(inter);
};