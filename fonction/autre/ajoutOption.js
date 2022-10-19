let tabSondage = require("../../variable/globale.js").getTabSondage();

const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();

const objVote = require("../../objet/vote.js");

const fonction = require("../utile.js");

module.exports =
{
    ajoutOption: (channel, idSondage, proposition) =>
    {
        console.log(tabSondage);
        let sondage = tabSondage[idSondage];
        console.log(sondage);
        let parametre = sondage.param;
        let propositionValide = parametre.propositionValide;

        if (propositionValide.lenght < alphabet.length)
        {
            propositionValide.push(proposition);

            let message = channel.messages.fetch(idSondage);
            
            let texte = parametre.texte;
            let designSondage = parametre.designSondage;
            
            let description = fonction.setDescription(propositionValide);
            designSondage.setDescription(description);

            let tabBouton = fonction.creerTabBouton(propositionValide, parametre.minuteur);

            let idVote = alphabet[propositionValide.lenght-1];
            sondage.tabVote.push(objVote.nouveau(idVote, proposition));

            let tabUser = sondage.tabUtilisateur;
            tabUser.forEach(user => user.tabVote.push(objVote.nouveau(idVote, proposition)));

            message.edit({content: texte, embeds: [designSondage], components: tabBouton});
        }
        else
            console.log("le nombre maximum de proposition est déjà atteint");
    }
};