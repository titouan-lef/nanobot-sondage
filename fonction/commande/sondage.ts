import fonction from "../utile";

import constante from "../../variable/constante";
const alphabet: string[] = constante.getAlphabet();
const xHeure: number = constante.getXHeure();
const tabMinuteur: number[] = constante.getTabMinuteur();

import { Sondage, ISondage } from "../../interface/Sondage";

import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, EmbedFooterOptions, Message, TextBasedChannel } from "discord.js";
import { Proposition } from "../../interface/Proposition";

export default
{
    getProposition: (interaction: ChatInputCommandInteraction): string[] =>
    {
        let tab: string[] = [];
        alphabet.forEach(lettre => {
                tab.push(interaction.options.getString(lettre.toLowerCase())? <string>interaction.options.getString(lettre.toLowerCase()) : '');
        });
        return tab;
    },

    creerSonsage: async (interaction: ChatInputCommandInteraction, question: string, temps: number, mesure: string,
        choixMultiple: boolean, listeProposition: string[], role1: string, role2: string, montrer: boolean, ajout: boolean,
        rappel: boolean): Promise<void> =>
    {
        // Paramétrage des variables liées au sondage
        let listePropositionValide: Proposition = getPropositionValide(listeProposition);
        let descriptionSondage: string = fonction.setDescription(listePropositionValide);

        let minuteur: number = creerMinuteur(mesure, temps);
        if (minuteur < xHeure)
            rappel = false;
        
        let tag: string = creerTag(role1, role2);
        
        let avertissement: string = creerAvertissement(montrer);

        let texteAjout: string = creerTexteAjout(ajout);
        
        let texte: string = "";
        texte = ajouterTexte(texte, tag);
        texte = ajouterTexte(texte, avertissement);
        texte = ajouterTexte(texte, texteAjout);

        // Création du design du sondage
        let finDans: string = "fin dans : " + finSondageDans(temps, mesure);
        let titreSondage: string = fonction.creerTitre(question, finDans);
        let footer: EmbedFooterOptions = await fonction.creerFooter("-1", choixMultiple);
        const designSondage: EmbedBuilder = fonction.creerDesignSondage([255, 0, 0], titreSondage, descriptionSondage, footer);

        // Bouton pour voter
        let tabBouton: ActionRowBuilder<ButtonBuilder>[] = fonction.creerTabBouton(listePropositionValide, temps);
        
        // Envoie du sondage dans le channel
        let channel: TextBasedChannel = <TextBasedChannel>interaction.channel;
        let envoi: Message = await channel.send({content: texte, embeds: [designSondage], components: tabBouton});

        let sondage: ISondage = await new Sondage({
            id_sondage: envoi.id,
            question: question,
            choix_multiple: choixMultiple,
            montrer: montrer,
            ajout: ajout,
            rappel: rappel,
            proposition_valide: listePropositionValide,
            tag: tag,
            texte: texte,
            design_sondage: designSondage,
            minuteur: minuteur
        }).save();

        // Paramétrage de la fin du sondage
        initFinSondage(envoi, sondage);

        await interaction.reply({ content: 'Commande réussite', ephemeral: true });
    }
};

function getPropositionValide(listeProposition: string[]): Proposition
{
    let tab: Proposition = {};

    for(let i = 0; i < listeProposition.length; ++i)
    {
        if (!listeProposition[i])
            break;
        else
            tab[alphabet[i]] = listeProposition[i];
    }

    return tab;
}

function creerMinuteur(mesure: string, temps: number): number
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
            return 0;
    }
}

function creerTag(role1: string, role2: string): string
{
    let message: string = "";
    if (role1)
    {
        if (role2)
            message = "<@&" + role1 + "> <@&" + role2 + ">";
        else
            message = "<@&" + role1 + ">";
    }
    return message;
}

function creerAvertissement(montrer: boolean): string
{ 
    if (montrer)
        return "Attention les votants seront révélés à la fin du sondage !";
    else
        return "";
}

function creerTexteAjout(ajout: boolean): string
{
    if (ajout)
        return "Vous avez la possibilité de rajouter une proposition en envoyant celle-ci en réponse au sondage";
    else
        return "";
}

function ajouterTexte(texte: string, texteAAjouter: string): string
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

function finSondageDans(temps: number, mesure: string): string
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

function initFinSondage(message: Message, sondage: ISondage): void
{
    let minuteur = sondage.minuteur;

    if (minuteur !== 0)
    {
        setTimeout(async (): Promise<void> => {await fonction.finSondage(message, sondage);}, minuteur);
        
        if (sondage.rappel)
            setTimeout(async (): Promise<void> => {await fonction.rappel(message.channel, sondage.tag, sondage.question);}, minuteur - xHeure / 2);
        
        for (const element of tabMinuteur)
        {
            if (minuteur > element)
                setTimeout(async (): Promise<void> => {await fonction.majSondage(message, sondage, element);}, minuteur - element);
            else
                break;        
        }
    }
}
