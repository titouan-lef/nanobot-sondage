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
            await messageProposition.delete();

            propositionValide[alphabet[nbProposition]] = proposition;

            let tabBouton = fonction.creerTabBouton(propositionValide, sondage.minuteur);
            
            let texte = sondage.texte;

            let designSondage = sondage.design_sondage;
            designSondage.data.description = fonction.setDescription(propositionValide);

            let message = await channel.messages.fetch(sondage.id_sondage);
            await message.edit({content: texte, embeds: [designSondage.data], components: tabBouton});

            await sondageBDD.updatePropositionValideEtEmbed(sondage.id_sondage, propositionValide, designSondage);
        }
        else
            console.log("le nombre maximum de proposition est déjà atteint");
    }
};