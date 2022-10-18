const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const idBoutonSupprime = "boutonSupprimerVote";
const nomBoutonSupprime = "Supprimer son vote";
const idBoutonNotif = "boutonNotif";
const nomBoutonNotif = "Recevoir une notif";


module.exports =
{
    getAlphabet: () => {
        return alphabet;
    },

    getIdBoutonSupprime: () => {
        return idBoutonSupprime;
    },

    getNomBoutonSupprime: () => {
        return nomBoutonSupprime;
    },

    getIdBoutonNotif: () => {
        return idBoutonNotif;
    },

    getNomBoutonNotif: () => {
        return nomBoutonNotif;
    }
};