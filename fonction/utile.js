const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

const constante = require("../variable/constante.js");
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();
const nomBoutonArreter = constante.getNomBoutonArreter();

const sondageBDD = require("../bdd/sondage.js");
const utilisateurBDD = require("../bdd/utilisateur.js");
const voteBDD = require("../bdd/vote.js");

module.exports =
{
    setDescription: (listePropositionValide) =>
    {
        let description = "";
        premierPassage = true;

        for (const [lettre, proposition] of Object.entries(listePropositionValide))
        {
            if (premierPassage)
                premierPassage = false;
            else
                description += "\n";
    
            description += "`" + lettre + ")` **" + proposition + "**";
        }

        return description;
    },

    creerTabBouton: (listePropositionValide, temps) =>
    {    
        return creerTabBouton(listePropositionValide, temps);
    },

    finSondage: async (interaction, message, sondage) =>
    {
        try {
            await message.delete();
        } catch (error) {
            console.log("Le sondage a été supprimé par quelqu'un");
        }

        let titreFin = "Sondage : " + sondage.question + " (Terminé)";
        let description = await afficherResultat(sondage);
        let footer = await creerFooter(sondage.choixMultiple);

        let designFinSondage = creerDesignSondage("#0000FF", titreFin, description, footer);
        await interaction.channel.send({content: sondage.tag, embeds: [designFinSondage]});
        
        await supprimerSondage(sondage.id_sondage);
    },

    rappel: async (interaction, tag, question) =>
    {
        let texte;

        if (tag)
            texte = tag + "\n";
        else
            texte = "";
        
        texte += 'Attention le sondage "' + question + '" finit dans une heure !';

        await interaction.channel.send(texte);
    },

    creerDesignSondage: (couleur, titreSondage, descriptionSondage, footer) =>
    {
        return creerDesignSondage(couleur, titreSondage, descriptionSondage, footer);
    },

    majDesign: async (message, propositionValide, minuteur, texte, designSondage) =>
    {
        let tabBouton = creerTabBouton(propositionValide, minuteur);
        await message.edit({content: texte, embeds: [designSondage.data], components: tabBouton});
    },

    creerFooter: async (choixMultiple) =>
    {
        return await creerFooter(choixMultiple);
    }
};

function creerTabBouton(listePropositionValide, temps)
{
    let tab = [];
    let ligneBouton;
    let i = 0;
    for (const [idProposition] of Object.entries(listePropositionValide))
    {
        if (i % 5 === 0)
        {
            if (i !== 0)
                tab.push(ligneBouton);
            
            ligneBouton = new ActionRowBuilder();
        }
        ++i;
        
        ligneBouton.addComponents(
            new ButtonBuilder()
                .setCustomId(idProposition)
                .setLabel(idProposition)
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
                    .setStyle(ButtonStyle.Success));

    tab.push(ligneBouton);

    return tab;
}

async function afficherResultat(sondage)
{
    let tabVote = await calculerNbVote(sondage);
    
    triInsertion(tabVote);

    let description = "";
    let stringVote;
    let premierPassage = true;

    tabVote.forEach(vote => {
        if (premierPassage)
            premierPassage = false;
        else
            description += "\n";
        
        if (vote.nbVote === 0 || vote.nbVote === 1)
            stringVote = " vote";
        else
            stringVote = " votes";

        description += "**" + vote.nomProposition + "** : " + vote.nbVote + stringVote;

        if (sondage.montrer && vote.listeVotant !== "")
            description += " (" + vote.listeVotant + ")";
    });

    return description;
}

async function calculerNbVote(sondage)
{
    let premierPassage;
    let listeUser;
    let tabVote = [];
    let tabVoteNonNul;

    let tabCleNomUtilisateur = await utilisateurBDD.trouverTousCle(sondage.id_sondage);

    for (const [idProposition, nomProposition] of Object.entries(sondage.proposition_valide))
    {
        premierPassage = true;
        listeUser = "";
        tabVoteNonNul = await voteBDD.trouverPropositionTabVote(idProposition, tabCleNomUtilisateur);

        for (const vote of tabVoteNonNul)
        {
            if (premierPassage)
                premierPassage = false;
            else
                listeUser += ", ";

            listeUser += await utilisateurBDD.trouverNom(vote.cle_utilisateur);
        };

        tabVote.push({nbVote: tabVoteNonNul.length, nomProposition: nomProposition, listeVotant: listeUser});
    }

    return tabVote;
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

function creerDesignSondage(couleur, titreSondage, descriptionSondage, footer)
{
    return new EmbedBuilder()
        .setColor(couleur)
        .setTitle(titreSondage)
        .setDescription(descriptionSondage)
        .setTimestamp()
        .setFooter({text: footer});
}

async function creerFooter(choixMultiple)
{
    let nbVotant = await utilisateurBDD.getNbUtilisateur(sondage.id_sondage);

    let footer;

    if (choixMultiple)
        footer =  "Sondage à choix multiple\n";
    else
        footer = "Sondage à choix unique\n";

    if (nbVotant <= 1)
        return footer + nbVotant + " votant";
    else
        return footer + nbVotant + " votants";
}

async function supprimerSondage(idSondage)
{
    let tabCleNomUtilisateur = await utilisateurBDD.trouverTousCle(idSondage);
    for (const cleUtilisateur of tabCleNomUtilisateur)
        await voteBDD.supprimerTous(cleUtilisateur._id);

    await utilisateurBDD.supprimerTous(idSondage);
    await sondageBDD.supprimer(idSondage);
}