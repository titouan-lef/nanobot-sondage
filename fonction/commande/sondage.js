const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();
const nomBoutonArreter = constante.getNomBoutonArreter();

let fonction = require("../utile.js");

module.exports = {
    
    getProposition: (interaction) =>
    {
        let tab = [];
        alphabet.forEach(lettre => tab.push(interaction.options.getString(lettre.toLowerCase())));
        return tab;
    },    

    getPropositionValide: (listeProposition) =>
    {
        let tab = [];

        for (const element of listeProposition)
        {
            if (element === null)
                break;
            else
                tab.push(element);
        }

        return tab;
    },

    setDescription: (listePropositionValide) =>
    {
        let description = "";

        for (let i = 0; i < listePropositionValide.length; ++i)
            description += getPropositionDescription(alphabet[i], listePropositionValide[i]);

        return description;
    },

    creerTag: (role1, role2) =>
    {
        let message;
        if (role1 !== null)
        {
            if (role2 !== null)
                message = "<@&" + role1 + "> <@&" + role2 + ">";
            else
                message = "<@&" + role1 + ">";
        }
        return message;
    },

    creerAvertissement: (montrer) =>
    { 
        if (montrer)
            return "Attention les votants seront révélés à la fin du sondage !";
        else
            return "";
    },

    finSondageDans: (temps, mesure) =>
    {
        if (temps === 0)
            return "indéterminé";
        else
        {
            if (temps === 1)
                return temps + " " + mesure;
            else
                return temps + " " + mesure + "s";
        }
    },

    creerFooter: (choixMultiple) =>
    {
        if (choixMultiple)
            return "Sondage à choix multiple";
        else
            return "Sondage à choix unique";
    },

    creerDesignSondage: (couleur, titreSondage, descriptionSondage, footer) =>
    {
        return creerDesignSondage(couleur, titreSondage, descriptionSondage, footer);
    },

    creerTabBouton: (listePropositionValide, temps) =>
    {
        let tab = [];
        let ligneBouton;
        for (let i = 0; i < listePropositionValide.length; ++i)
        {
            if (i % 5 === 0)
            {
                if (i !== 0)
                    tab.push(ligneBouton);
                
                ligneBouton = new ActionRowBuilder();
            }
            
            ligneBouton.addComponents(
                new ButtonBuilder()
                    .setCustomId(alphabet[i])
                    .setLabel(alphabet[i])
                    .setStyle(ButtonStyle.Primary));
        }
        tab.push(ligneBouton);

        //BOUTON : Bouton pour supprimer son vote et un bouton pour recevoir une notif
        ligneBouton = creerBoutonSuppEtNotif();

        //BOUTON : Bouton pour arreter le sondage
        if (temps === 0)
            ligneBouton.addComponents(
                    new ButtonBuilder()
                        .setCustomId(idBoutonArreter)
                        .setLabel(nomBoutonArreter)
                        .setStyle(ButtonStyle.Danger));

        tab.push(ligneBouton);

        return tab;
    },

    initFinSondage: (interaction, message, temps, mesure) =>
    {
        if (temps !== 0)
            setTimeout(() => fonction.finSondage(interaction, message), minuteur(mesure, temps));
    }
};


function getPropositionDescription(lettreProposition, proposition)
{
    let description = "";

    if (lettreProposition !== "A")
        description = "\n";
    
    return description + "`" + lettreProposition + ")` **" + proposition + "**";
}

function creerBoutonSuppEtNotif()
{
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idBoutonSupprime)
                .setLabel(nomBoutonSupprime)
                .setStyle(ButtonStyle.Danger))
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idBoutonNotif)
                .setLabel(nomBoutonNotif)
                .setStyle(ButtonStyle.Secondary));
}

function minuteur(mesure, temps)
{
    switch (mesure)
    {
        case "jour":
            return temps * 1000 * 60 * 60 * 24;
        case "heure":
            return temps * 1000 * 60 * 60;
        case "minute":
            return temps * 1000 * 60;
        default:
            console.log("erreur sur la durée du sondage");
            return;
    }
}