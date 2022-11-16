const alphabet: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const idBoutonSupprime: string = "boutonSupprimerVote";
const nomBoutonSupprime: string = "Supprimer son vote";
const idBoutonNotif: string = "boutonNotif";
const nomBoutonNotif: string = "Recevoir une notif";
const idBoutonArreter: string = "boutonArreter";
const nomBoutonArreter: string = "Arrêter le sondage";
const xHeure: number = 2 * 1000 * 60 * 60;

const uneHeure: number = 1000 * 60 * 60;
const unJour: number = 24 * uneHeure;

const tabMinuteur: number[] = [];

for (let i = 0; i < 23; ++i)
    tabMinuteur.push((i + 1) * uneHeure);

for (let i = 0; i < 7; ++i)
    tabMinuteur.push((i + 1) * unJour);


export default
{
    getAlphabet: (): string[] => {
        return alphabet;
    },

    getIdBoutonSupprime: (): string => {
        return idBoutonSupprime;
    },

    getNomBoutonSupprime: (): string => {
        return nomBoutonSupprime;
    },

    getIdBoutonNotif: (): string => {
        return idBoutonNotif;
    },

    getNomBoutonNotif: (): string => {
        return nomBoutonNotif;
    },

    getIdBoutonArreter: (): string => {
        return idBoutonArreter;
    },

    getNomBoutonArreter: (): string => {
        return nomBoutonArreter;
    },

    getXHeure: (): number => {
        return xHeure;
    },

    getUneHeure: (): number => {
        return uneHeure;
    },

    getUnJour: (): number => {
        return unJour;
    },

    getTabMinuteur: (): number[] => {
        return tabMinuteur;
    }
};