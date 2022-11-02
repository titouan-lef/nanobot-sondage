const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();

const fonction = require("../utile.js");

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
            propositionValide[alphabet[nbProposition]] = proposition;
            
            let texte = sondage.texte;
            let designSondage = sondage.design_sondage;
            
            let description = fonction.setDescription(propositionValide);
            designSondage.setDescription(description);

            let tabBouton = fonction.creerTabBouton(propositionValide, sondage.minuteur);

            await messageProposition.delete();

            let message = await channel.messages.fetch(sondage.id_sondage);
            await message.edit({content: texte, embeds: [designSondage], components: tabBouton});
        }
        else
            console.log("le nombre maximum de proposition est déjà atteint");
    }
};