module.exports = {
    nouveau: (idSondage, parametre) =>
    {
        return {
            id : idSondage,
            tabUtilisateur : [],
            tabVote : creerTabVote(parametre.propositionValide),
            param : parametre
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