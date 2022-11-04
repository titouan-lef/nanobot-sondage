const fonction = require("../fonction/utile.js");

const sondageBDD = require("../bdd/sondage.js");

module.exports = async (message) =>
{
    if (message.type === 19)
    {
        let idSondage = message.reference.messageId;
        let sondage = await sondageBDD.trouver(idSondage);
        
        if (sondage)
        {
            if ("#" + sondage._id === message.content)
            {
                sondage.tag += "\n:warning: Le sondage a été arrêté de force par " + message.author.username;

                let messageSondage = await message.channel.messages.fetch(sondage.id_sondage);;

                try {
                    await message.delete();
                } catch (error) {
                    console.log("Le message d'arrêt a été supprimé par quelqu'un");
                }

                await fonction.finSondage(messageSondage, sondage);
            }
            else
            {
                if (sondage.ajout)
                    await require("../fonction/autre/ajoutOption.js").ajoutOption(message, sondage);
            }
        }
    }
};