const { PermissionsBitField } = require('discord.js');

const fonction = require("../fonction/utile.js");

module.exports = (bot, inter) => {
    if (inter.channel.permissionsFor(inter.guild.members.me).has(PermissionsBitField.Flags.ViewChannel))
    {
        if (inter.isCommand() && inter.commandName in bot.commande)
            require("../interaction/sondage.js")(inter);
    }
    else
        console.log("Le bot n'a pas accès au channel");

    if (inter.isButton())
        require("../interaction/bouton.js")(inter);
};