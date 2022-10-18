module.exports = (bot, inter) => {
    try
    {       
        if (inter.isCommand() && inter.commandName in bot.commande)
            require("../interaction/sondage.js")(inter);
    } catch (error) {
        console.log("commande impossible. Channel privé ?");
    }

    if (inter.isButton())
        require("../interaction/bouton.js")(inter);
};