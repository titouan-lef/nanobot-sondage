const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();

const objSondage = require("../../objet/sondage.js");
const objParam = require("../../objet/param.js");

const fonction = require("../utile.js");

let tabSondage = require("../../variable/globale.js");

module.exports =
{
    getProposition: (interaction) =>
    {
        let tab = [];
        alphabet.forEach(lettre => tab.push(interaction.options.getString(lettre.toLowerCase())));
        return tab;
    },

    creerSonsage: async (interaction, question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer) =>
    {
        // Paramétrage des variables liées au sondage
        let listePropositionValide = getPropositionValide(listeProposition);
        let descriptionSondage = fonction.setDescription(listePropositionValide);
        
        let tag = creerTag(role1, role2);
        
        let avertissement = creerAvertissement(montrer);
        
        let texte;
        if (tag && avertissement)
            texte = tag + "\n" + avertissement;
        else
        {
            if (tag)
                texte = tag;
            else
                texte = avertissement;
        }

        // Création du design du sondage
        let titreSondage = "Sondage : " + question + " (fin dans : " + finSondageDans(temps, mesure) + ")";
        let footer = creerFooter(choixMultiple);
        const designSondage = fonction.creerDesignSondage("FF0000", titreSondage, descriptionSondage, footer);

        // Bouton pour voter
        let tabBouton = fonction.creerTabBouton(listePropositionValide, temps);

        // Envoie du sondage dans le channel
        let envoi = await interaction.channel.send({content: texte, embeds: [designSondage], components: tabBouton});

        // Paramètre du sondage
        let paramSondage = objParam.nouveau(question, temps, mesure, choixMultiple, montrer, listePropositionValide, tag, texte, designSondage)

        // Ajout du sondage au tableau
        let sondage = objSondage.nouveau(envoi.id, paramSondage);
        tabSondage.push(sondage);

        // Paramétrage de la fin du sondage
        initFinSondage(interaction, envoi, sondage.param.minuteur);

        await interaction.reply({ content: 'Commande réussite', ephemeral: true });
    }
};

function getPropositionValide(listeProposition)
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
}

function creerTag(role1, role2)
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
}

function creerAvertissement(montrer)
{ 
    if (montrer)
        return "Attention les votants seront révélés à la fin du sondage !";
    else
        return "";
}

function finSondageDans(temps, mesure)
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
}

function creerFooter(choixMultiple)
{
    if (choixMultiple)
        return "Sondage à choix multiple";
    else
        return "Sondage à choix unique";
}

function initFinSondage(interaction, message, minuteur)
{
    if (minuteur !== 0)
        setTimeout(() => fonction.finSondage(interaction, message), minuteur);
}