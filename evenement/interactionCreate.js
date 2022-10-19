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

    if (inter.isMessageComponent() && inter.message === "REPLY")
    {
        console.log("message trouvé");
        let idOriginalMessage = inter.message.reference.messageId;
        let idSondage = fonction.trouverIndexSondage(idOriginalMessage);
        if (idSondage !== -1)
        {
            console.log("sondage trouvé");
            require("../fonction/autre/ajoutOption.js").ajoutOption(inter.channel, idSondage, inter.message.content);
            console.log("ça marche");
        }
    }
};