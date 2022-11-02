const { PermissionsBitField } = require('discord.js');

module.exports = async (bot, inter) => {
    if (inter.channel.permissionsFor(inter.guild.members.me).has(PermissionsBitField.Flags.ViewChannel))
    {
        if (inter.isCommand() && inter.commandName in bot.commande)
            await require("../interaction/" + inter.commandName + ".js")(inter);
    }
    else
        console.log("Le bot n'a pas accès au channel");

    if (inter.isButton())
        await require("../interaction/bouton.js")(inter);
};