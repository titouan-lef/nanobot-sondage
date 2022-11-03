const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();

const fonction = require("../utile.js");

const sondageBDD = require("../../bdd/sondage.js");

module.exports =
{
    ajoutOption: async (messageProposition, sondage) =>
    {
        let channel = messageProposition.channel;
        let proposition = messageProposition.content;
        let propositionValide = sondage.proposition_valide;
        let nbProposition = Object.keys(propositionValide).length;

        if (nbProposition < alphabet.length)
        {
            await messageProposition.delete();// Supression du message qui ajoute une proposition

            propositionValide[alphabet[nbProposition]] = proposition;// Ajout de la nouvelle proposition

            let designSondage = sondage.design_sondage;
            designSondage.data.description = fonction.setDescription(propositionValide);

            let message = await channel.messages.fetch(sondage.id_sondage);

            await fonction.majDesign(message, propositionValide, sondage.texte, designSondage);

            await sondageBDD.updatePropositionValideEtEmbed(sondage.id_sondage, propositionValide, designSondage);
        }
        else
            console.log("le nombre maximum de proposition est déjà atteint");
    }
};