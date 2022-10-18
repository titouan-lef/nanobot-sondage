module.exports = {
    nouveau: (idSondage, listePropositionValide, boolChoixMultiple, boolMontrer) =>
    {
        return {
            id : idSondage,
            tabUtilisateur : [],
            tabVote : creerTabVote(listePropositionValide),
            choixMultiple : boolChoixMultiple,
            montrer : boolMontrer
        };
    }
};

const alphabet = require("../variable/constante.js").getAlphabet();

function creerTabVote(listePropositionValide)
{
    const objVote = require("./vote.js");

    tab = [];

    for (let i = 0; i < listePropositionValide.length; i++)
        tab.push(objVote.nouveau(alphabet[i], listePropositionValide[i]));

    return tab;
}