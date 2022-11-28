import {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ColorResolvable, Message, TextBasedChannel, EmbedFooterOptions} from "discord.js";

import constante from "../variable/constante";
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();
const nomBoutonArreter = constante.getNomBoutonArreter();
const unJour = constante.getUnJour();


import {Sondage, ISondage} from "../interface/Sondage";
import {Utilisateur, IUtilisateur} from "../interface/Utilisateur";
import {Vote, IVote} from "../interface/Vote";

import { Proposition } from "../interface/Proposition";
import { VoteFinal } from "../interface/VoteFinal";

export default
{
    setDescription: (listePropositionValide: Proposition): string =>
    {
        let description: string = "";
        let premierPassage: boolean = true;

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

    creerTabBouton: (listePropositionValide: Proposition, temps: number): ActionRowBuilder<ButtonBuilder>[] =>
    {    
        return creerTabBouton(listePropositionValide, temps);
    },

    creerTitre: (question: string, finDans: string): string =>
    {
        return creerTitre(question, finDans);
    },

    majSondage: async (message: Message, sondage: ISondage, minuteur: number): Promise<void> =>
    {
        let tempsRestant: number;
        let mesure: string;
        let finDans: string;

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

        sondage.design_sondage = EmbedBuilder.from(sondage.design_sondage)
            .setTitle(creerTitre(sondage.question, finDans))
            .setTimestamp(new Date());

        await Sondage.updateEmbed(sondage.id_sondage, sondage.design_sondage);

        await majDesign(message, sondage);
    },

    finSondage: async (message: Message, sondage: ISondage): Promise<void> =>
    {
        try {
            await message.delete();
        } catch (error) {
            console.log("Le sondage a été supprimé par quelqu'un");
        }

        let titreFin: string = creerTitre(sondage.question, "Terminé");
        let description: string = await afficherResultat(sondage);
        let footer: EmbedFooterOptions = await creerFooter(sondage.id_sondage, sondage.choix_multiple);

        let designFinSondage: EmbedBuilder = creerDesignSondage([0, 0, 255], titreFin, description, footer);
        await message.channel.send({content: sondage.tag, embeds: [designFinSondage]});
        
        await supprimerSondage(sondage.id_sondage);
    },

    rappel: async (channel: TextBasedChannel, tag: string, question: string): Promise<void> =>
    {
        let texte: string;

        if (tag)
            texte = tag + "\n";
        else
            texte = "";
        
        texte += 'Attention le sondage "' + question + '" finit dans une heure !';

        await channel.send(texte);
    },

    creerDesignSondage: (couleur: ColorResolvable, titreSondage: string, descriptionSondage: string, footer: EmbedFooterOptions): EmbedBuilder =>
    {
        return creerDesignSondage(couleur, titreSondage, descriptionSondage, footer);
    },

    majDesign: async(message: Message, sondage: ISondage): Promise<void> =>
    {
        await majDesign(message, sondage);
    },

    creerFooter: (idSondage: string, choixMultiple: boolean): Promise<EmbedFooterOptions> =>
    {
        return creerFooter(idSondage, choixMultiple);
    }
};

function creerTabBouton(listePropositionValide: Proposition, temps: number): ActionRowBuilder<ButtonBuilder>[]
{
    let tab: ActionRowBuilder<ButtonBuilder>[] = [];
    let ligneBouton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();
    let i: number = 0;
    for (const [idProposition] of Object.entries(listePropositionValide))
    {
        if (i % 5 === 0)
        {
            if (i !== 0)
                tab.push(ligneBouton);
            
            ligneBouton = new ActionRowBuilder<ButtonBuilder>();
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

function creerTitre (question: string, finDans: string): string
{
    return "Sondage : " + question + " (" + finDans + ")";
}

async function afficherResultat(sondage: ISondage): Promise<string>
{
    let tabVote: VoteFinal[] = await calculerNbVote(sondage);
    
    triInsertion(tabVote);

    let description: string = "";
    let stringVote: string;
    let premierPassage: boolean = true;

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

async function calculerNbVote(sondage: ISondage): Promise<VoteFinal[]>
{
    let premierPassage: boolean;
    let listeUser: string;
    let tabVote: VoteFinal[] = [];
    let tabVoteNonNul: IVote[];

    let tabCleNomUtilisateur: IUtilisateur[] = await Utilisateur.trouverTous(sondage.id_sondage);

    for (const [idProposition, nomProposition] of Object.entries(sondage.proposition_valide))
    {
        premierPassage = true;
        listeUser = "";
        tabVoteNonNul = await Vote.trouverPropositionTabVote(idProposition, tabCleNomUtilisateur);

        for (const vote of tabVoteNonNul)
        {
            if (premierPassage)
                premierPassage = false;
            else
                listeUser += ", ";

            listeUser += await Utilisateur.trouverNom(vote.cle_utilisateur);
        }

        tabVote.push({nbVote: tabVoteNonNul.length, nomProposition: nomProposition, listeVotant: listeUser});
    }

    return tabVote;
}

function triInsertion(tabVote: VoteFinal[]): void
{
    let tmp: VoteFinal;
    let j: number;              
    
    for(let i = 1; i < tabVote.length; i++)
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

function creerBoutonSuppEtNotif(): ActionRowBuilder<ButtonBuilder>
{
    return new ActionRowBuilder<ButtonBuilder>()
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

function creerDesignSondage(couleur: ColorResolvable, titreSondage: string, descriptionSondage: string, footer: EmbedFooterOptions): EmbedBuilder
{
    return new EmbedBuilder()
        .setColor(couleur)
        .setTitle(titreSondage)
        .setDescription(descriptionSondage)
        .setTimestamp()
        .setFooter(footer);
}

async function majDesign (message: Message, sondage: ISondage): Promise<void>
{
    let tabBouton: ActionRowBuilder<ButtonBuilder>[] = creerTabBouton(sondage.proposition_valide, sondage.minuteur);
    let footer: EmbedFooterOptions = await creerFooter(sondage.id_sondage, sondage.choix_multiple);
    
    sondage.design_sondage = EmbedBuilder.from(sondage.design_sondage).setFooter(footer)

    await message.edit({content: sondage.texte, embeds: [sondage.design_sondage.data], components: tabBouton});
}

async function creerFooter(idSondage: string, choixMultiple: boolean): Promise<EmbedFooterOptions>
{
    let nbVotant: number = 0;
    if (idSondage !== "-1")
        nbVotant = await Utilisateur.getNbUtilisateur(idSondage);

    let footer: EmbedFooterOptions = {text: ""};

    if (choixMultiple)
        footer.text =  "Sondage à choix multiple\n";
    else
        footer.text = "Sondage à choix unique\n";

    if (nbVotant <= 1)
        footer.text += nbVotant + " votant";
    else
        footer.text += nbVotant + " votants";
    
    return footer;
}

async function supprimerSondage(idSondage: string): Promise<void>
{
    let tabUtilisateur: IUtilisateur[] = await Utilisateur.trouverTous(idSondage);
    for (const utilisateur of tabUtilisateur)
    {
        if (utilisateur._id !== undefined)
            await Vote.supprimerTous(utilisateur._id);
    }
        
    await Utilisateur.supprimerTous(idSondage);

    Sondage.supprimer(idSondage);
}