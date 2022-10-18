module.exports = {
    nouveau: (idUser, tabVote) =>
    {
        return {
            id : idUser,
            tabVote : creerTabVoteUser(tabVote)
        };
    }
};

const constante = require("../variable/constante.js");
const alphabet = constante.getAlphabet();
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();

function creerTabVoteUser(tabVote)
{
    const objVote = require("./vote.js");

    let tab = [];

    for (let i = 0; i < tabVote.length; i++)
        tab.push(objVote.nouveau(alphabet[i], tabVote[i].proposition));
    
    tab.push(objVote.nouveau(idBoutonSupprime, nomBoutonSupprime));

    return tab;
}