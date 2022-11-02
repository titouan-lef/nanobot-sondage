const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();
const xHeure = constante.getXHeure();

const sondageBDD = require("../../bdd/sondage.js");

const fonction = require("../utile.js");

module.exports =
{
    getProposition: (interaction) =>
    {
        let tab = [];
        alphabet.forEach(lettre => tab.push(interaction.options.getString(lettre.toLowerCase())));
        return tab;
    },

    creerSonsage: async (interaction, question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer, ajout, rappel) =>
    {
        // Paramétrage des variables liées au sondage
        let listePropositionValide = getPropositionValide(listeProposition);
        let descriptionSondage = fonction.setDescription(listePropositionValide);

        let minuteur = creerMinuteur(mesure, temps);
        if (minuteur < xHeure)
            rappel = false;
        
        let tag = creerTag(role1, role2);
        
        let avertissement = creerAvertissement(montrer);

        let texteAjout = creerTexteAjout(ajout);
        
        let texte = "";
        texte = ajouterTexte(texte, tag);
        texte = ajouterTexte(texte, avertissement);
        texte = ajouterTexte(texte, texteAjout);

        // Création du design du sondage
        let titreSondage = "Sondage : " + question + " (fin dans : " + finSondageDans(temps, mesure) + ")";
        let footer = creerFooter(choixMultiple);
        const designSondage = fonction.creerDesignSondage("FF0000", titreSondage, descriptionSondage, footer);

        // Bouton pour voter
        let tabBouton = fonction.creerTabBouton(listePropositionValide, temps);

        // Envoie du sondage dans le channel
        let envoi = await interaction.channel.send({content: texte, embeds: [designSondage], components: tabBouton});

        // Ajout du sondage à la BDD
        let sondage;
        console.log("etape 1");
        sondageBDD.creer(envoi.id, question, choixMultiple, montrer, ajout, rappel, listePropositionValide, tag, texte, designSondage, minuteur)
            .then(result => sondage = result);
        console.log("etape 2");
        let str = JSON.stringify(sondage);
        console.log(str);
        console.log("etape 3");


        // Paramétrage de la fin du sondage
        initFinSondage(interaction, envoi, sondage);

        await interaction.reply({ content: 'Commande réussite', ephemeral: true });
    }
};

function getPropositionValide(listeProposition)
{
    let tab = {};

    for(let i = 0; i < listeProposition.length; ++i)
    {
        if (listeProposition[i] === null)
            break;
        else
            tab[alphabet[i]] = listeProposition[i];
    }

    return tab;
}

function creerMinuteur(mesure, temps)
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

function creerTag(role1, role2)
{
    let message = "";
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

function creerTexteAjout(ajout)
{
    if (ajout)
        return "Vous avez la possibilité de rajouter une proposition en envoyant celle-ci en réponse au sondage";
    else
        return "";
}

function ajouterTexte(texte, texteAAjouter)
{
    if (texteAAjouter)
    {
        if (texte === "")
            texte = texteAAjouter;
        else
            texte += "\n" + texteAAjouter;
    }

    return texte;
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

async function initFinSondage(interaction, message, sondage)
{
    let minuteur = sondage.minuteur;

    if (minuteur !== 0)
        setTimeout(() => fonction.finSondage(interaction, message, sondage), minuteur);
    
    if (sondage.rappel)
        setTimeout(() => fonction.rappel(interaction, sondage.tag, sondage.question), minuteur - xHeure / 2);
}