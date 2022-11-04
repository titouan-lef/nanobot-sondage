const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();

const fonction = require("../utile.js");

const sondageBDD = require("../../bdd/sondage.js");

module.exports =
{
    forcerArret: async (message, sondage) =>
    {
        if (sondage.tag)
            sondage.tag += "\n:warning: Le sondage a été arrêté de force par " + message.author.username;
        else
            sondage.tag = ":warning: Le sondage a été arrêté de force par " + message.author.username;

        let messageSondage = await message.channel.messages.fetch(sondage.id_sondage);

        try {
            await message.delete();
        } catch (error) {
            console.log("Le message d'arrêt a été supprimé par quelqu'un");
        }

        await fonction.finSondage(messageSondage, sondage);
    },

    ajoutOption: async (messageProposition, sondage) =>
    {
        if (sondage.ajout)
        {
            let channel = messageProposition.channel;
            let proposition = messageProposition.content;
            let propositionValide = sondage.proposition_valide;
            let nbProposition = Object.keys(propositionValide).length;

            if (nbProposition < alphabet.length)
            {
                try {
                    await messageProposition.delete();// Supression du message qui ajoute une proposition
                } catch (error) {
                    console.log("Le sondage a été supprimé par quelqu'un");
                }
                
                propositionValide[alphabet[nbProposition]] = proposition;// Ajout de la nouvelle proposition

                let designSondage = sondage.design_sondage;
                designSondage.data.description = fonction.setDescription(propositionValide);

                let message = await channel.messages.fetch(sondage.id_sondage);

                await fonction.majDesign(message, sondage);

                await sondageBDD.updatePropositionValideEtEmbed(sondage.id_sondage, propositionValide, designSondage);
            }
            else
                console.log("le nombre maximum de proposition est déjà atteint");
        }
    }
};