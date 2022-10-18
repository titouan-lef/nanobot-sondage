module.exports = (bot, inter) => {
    console.log(inter.channel.type);

    if (inter.isCommand() && inter.commandName in bot.commande)
        require("../interaction/sondage.js")(inter);

    if (inter.isButton())
        require("../interaction/bouton.js")(inter);
};