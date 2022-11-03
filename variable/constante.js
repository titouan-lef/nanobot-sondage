const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const idBoutonSupprime = "boutonSupprimerVote";
const nomBoutonSupprime = "Supprimer son vote";
const idBoutonNotif = "boutonNotif";
const nomBoutonNotif = "Recevoir une notif";
const idBoutonArreter = "boutonArreter";
const nomBoutonArreter = "Arrêter le sondage";
const xHeure = 2 * 1000 * 60 * 60;

const uneHeure = 1000 * 60 * 60;
const unJour = 24 * uneHeure;

const tabMinuteur = [];

for (let i = 0; i < 23; ++i)
    tabMinuteur.push((i + 1) * uneHeure);

for (let i = 0; i < 7; ++i)
    tabMinuteur.push((i + 1) * unJour);


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
    },

    getIdBoutonArreter: () => {
        return idBoutonArreter;
    },

    getNomBoutonArreter: () => {
        return nomBoutonArreter;
    },

    getXHeure: () => {
        return xHeure;
    },

    getUneHeure: () => {
        return uneHeure;
    },

    getUnJour: () => {
        return unJour;
    },

    getTabMinuteur: () => {
        return tabMinuteur;
    }
};