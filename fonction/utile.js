const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

const constante = require("../variable/constante.js");
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();
const nomBoutonArreter = constante.getNomBoutonArreter();
const uneHeure = constante.getUneHeure();
const unJour = constante.getUnJour();

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

    creerTitre: (question, finDans) =>
    {
        return creerTitre(question, finDans);
    },

    majSondage: async (message, sondage, minuteur) =>
    {
        let tempsRestant;
        let mesure;
        let finDans;

        if (minuteur < unJour)
        {
            mesure = " heure";
            tempsRestant = minuteur / 1000 / 60 / 60;// Temps restant en heure
        }
        else
        {
            mesure = " jour";
            tempsRestant = minuteur / 1000 / 60 / 60 / 24;// Temps restant en jour
        }

        if (tempsRestant === 1)
            finDans = tempsRestant + mesure;
        else
            finDans = tempsRestant + mesure + "s";
        
        finDans = "fin dans : " + finDans;

        sondage.design_sondage.data.title = creerTitre(sondage.question, finDans);
        sondage.design_sondage.data.timestamp = new Date().toISOString();
        await sondageBDD.updateEmbed(sondage.id_sondage, sondage.design_sondage);

        await majDesign(message, sondage);
    },

    finSondage: async (message, sondage) =>
    {
        try {
            await message.delete();
        } catch (error) {
            console.log("Le sondage a été supprimé par quelqu'un");
        }

        let titreFin = creerTitre(sondage.question, "Terminé");
        let description = await afficherResultat(sondage);
        let footer = await creerFooter(sondage.id_sondage, sondage.choixMultiple);

        let designFinSondage = creerDesignSondage("#0000FF", titreFin, description, footer);
        await message.channel.send({content: sondage.tag, embeds: [designFinSondage]});
        
        await supprimerSondage(sondage.id_sondage);
    },

    rappel: async (channel, tag, question) =>
    {
        let texte;

        if (tag)
            texte = tag + "\n";
        else
            texte = "";
        
        texte += 'Attention le sondage "' + question + '" finit dans une heure !';

        await channel.send(texte);
    },

    creerDesignSondage: (couleur, titreSondage, descriptionSondage, footer) =>
    {
        return creerDesignSondage(couleur, titreSondage, descriptionSondage, footer);
    },

    majDesign: async (couleur, titreSondage, descriptionSondage, footer) =>
    {
        await majDesign(couleur, titreSondage, descriptionSondage, footer);
    },

    creerFooter: async (idSondage, choixMultiple) =>
    {
        return await creerFooter(idSondage, choixMultiple);
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

function creerTitre (question, finDans)
{
    return "Sondage : " + question + " (" + finDans + ")";
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

async function majDesign (message, sondage)
{
    let tabBouton = creerTabBouton(sondage.proposition_valide, sondage.minuteur);
    
    sondage.design_sondage.data.footer.text = await creerFooter(sondage.id_sondage, sondage.choix_multiple);

    await message.edit({content: sondage.texte, embeds: [sondage.design_sondage.data], components: tabBouton});
}

async function creerFooter(idSondage, choixMultiple)
{
    let nbVotant = 0;
    if (idSondage !== -1)
        nbVotant = await utilisateurBDD.getNbUtilisateur(idSondage);

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