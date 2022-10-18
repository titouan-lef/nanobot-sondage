const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

const constante = require("../../variable/constante.js");
const alphabet = constante.getAlphabet();
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();

let tabSondage = require("../../variable/globale.js").getTabSondage();

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

        for (let i = 0; i < listeProposition.length; ++i)
        {
            if (listeProposition[i] === null)
                break;
            else
                tab.push(listeProposition[i]);
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
            if (temps === 0 || temps === 1)
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

    creerTabBouton: (listePropositionValide) =>
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
        tab.push(creerBoutonSuppEtNotif());

        return tab;
    },

    initFinSondage: (interaction, message, temps, mesure, question, footer, tag) =>
    {
        if (temps !== 0)
            setTimeout(() => finSondage(interaction, message, question, footer, tag), minuteur(mesure, temps));
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

function finSondage(interaction, message, question, footer, tag)
{
    message.delete();
    let titreFin = "Sondage : " + question + " (Terminé)";
    let description = afficherResultat(message);
    let designFinSondage = creerDesignSondage("#0000FF", titreFin, description, footer);
    interaction.channel.send({content: tag, embeds: [designFinSondage]});
    tabSondage.splice(trouverIndexSondage(message.id), 1);//Suppression du sondage
}

function afficherResultat(message)
{
    let description = "";
    let stringVote;
    let sondage = tabSondage[trouverIndexSondage(message.id)];
    let premierPassage = true;

    calculerNbVote(sondage);
    
    triInsertion(sondage.tabVote);

    sondage.tabVote.forEach(vote => {
        if (premierPassage)
            premierPassage = false;
        else
            description += "\n";
        
        if (vote.nbVote === 0 || vote.nbVote === 1)
            stringVote = " vote";
        else
            stringVote = " votes";

        description += "`" + vote.id + ")` **" + vote.proposition + "** : " + vote.nbVote + stringVote;

        if (sondage.montrer && vote.votant !== "")
            description += " (" + vote.votant + ")";
    });

    return description;
}

function trouverIndexSondage(idSondage)
{
    for (let i = 0; i < tabSondage.length; i++)
    {
        if (tabSondage[i].id === idSondage)
            return i;
    }
    console.log("sondage " + idSondage + " introuvable");
}

function calculerNbVote(sondage)
{
    let premierPassage;
    let listeUser;

    for (let i = 0; i < sondage.tabVote.length; i++)
    {
        premierPassage = true;
        listeUser = "";

        for (let j = 0; j < sondage.tabUtilisateur.length; j++)
        {
            if (sondage.tabUtilisateur[j].tabVote[i].nbVote === 1)
            {
                ++sondage.tabVote[i].nbVote;
                
                if (premierPassage)
                    premierPassage = false;
                else
                    listeUser += ", ";

                listeUser += sondage.tabUtilisateur[j].id.username;
            }
        }

        sondage.tabVote[i]["votant"] = listeUser;
    }
}

function triInsertion(tabVote)
{
    let tmp, j;                  
    
    for(i = 1; i < tabVote.length; i++)
    {
        //stocker la valeur actuelle 
        tmp = tabVote[i]
        j = i - 1
        while (j >= 0 && tabVote[j].nbVote < tmp.nbVote)
        {
            // déplacer le nombre
            tabVote[j+1] = tabVote[j]
            j--
        }
        //Insère la valeur temporaire à la position correcte dans la partie triée.
        tabVote[j+1] = tmp
    }
}

function creerDesignSondage(couleur, titreSondage, descriptionSondage, footer)
{
    return new EmbedBuilder()
        .setColor(couleur)
        .setTitle(titreSondage)
        .setDescription(descriptionSondage)
        .setTimestamp()
        .setFooter({text: footer});
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