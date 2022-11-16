import fonction from "../fonction/element/bouton";
import utile from "../fonction/utile";

import constante from "../variable/constante";
const idBoutonSupprime = constante.getIdBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();

import { ButtonInteraction } from "discord.js";

import { Sondage, SondageBDD } from "../interface/Sondage";
const sondageBDD = new SondageBDD();
import { Utilisateur, UtilisateurBDD } from "../interface/Utilisateur";
const utilisateurBDD = new UtilisateurBDD();
import { Vote, VoteBDD } from "../interface/Vote";
const voteBDD = new VoteBDD();

export default async (interaction: ButtonInteraction): Promise<void> => {
    const idSondage: string = interaction.message.id;
    const idUtilisateur: string = interaction.user.id;
    const nomUtilisateur: string = interaction.user.username;

    let utilisateur: Utilisateur = await utilisateurBDD.trouver(idSondage, idUtilisateur);// On cherche l'utilisateur qui a appuyé sur un bouton (celui-ci n'existe peut être pas)

    switch (interaction.customId)
    {
        case idBoutonNotif:
            await interactionNotif(interaction, utilisateur);
            break;
        case idBoutonArreter:
            await interactionArreter(interaction, idSondage);
            break;
        default:
            if (interaction.customId === idBoutonSupprime)
                await interactionSupprimer(interaction, idSondage, idUtilisateur, utilisateur);
            else
                await interactionVote(interaction, idSondage, idUtilisateur, nomUtilisateur, utilisateur);
            break;
    }

    await interaction.deferUpdate();
};

async function interactionNotif(interaction: ButtonInteraction, utilisateur: Utilisateur): Promise<void>
{
    let message: string = await fonction.messageVote(utilisateur)
    await interaction.user.send(message);
}

async function interactionArreter(interaction: ButtonInteraction, idSondage: string): Promise<void>
{
    let sondage: Sondage = <Sondage> await sondageBDD.trouver(idSondage);
    await utile.finSondage(interaction.message, sondage);
}

async function interactionSupprimer(interaction: ButtonInteraction, idSondage: string, idUtilisateur: string, utilisateur: Utilisateur): Promise<void>
{
    if (utilisateur)// Si l'utilisateur existe
    {
        await voteBDD.supprimerTous(<string>utilisateur._id);
        await utilisateurBDD.supprimer(idSondage, idUtilisateur);

        let sondage: Sondage = <Sondage> await sondageBDD.trouver(idSondage);
        await utile.majDesign(interaction.message, sondage);
    }
}

async function interactionVote(interaction: ButtonInteraction, idSondage: string, idUtilisateur: string, nomUtilisateur: string, utilisateur: Utilisateur): Promise<void>
{
    if (!utilisateur)// Si l'utilisateur n'existe pas
        utilisateur = await utilisateurBDD.creer(idUtilisateur, nomUtilisateur, idSondage);
    
    let sondage: Sondage = <Sondage> await sondageBDD.trouver(idSondage);

    let idProposition: string = interaction.customId;
    let nomProposition: string = sondage.proposition_valide[idProposition];

    if (!sondage.choix_multiple) // Choix unique
    {
        await voteBDD.supprimerTous(<string>utilisateur._id);
        await voteBDD.creer(idProposition, nomProposition, <string>utilisateur._id);
    }
    else // Choix multiple possible
    {
        let vote: Vote = await voteBDD.trouverProposition(<string>utilisateur._id, idProposition);

        if (!vote) // Si la personnes n'a pas déjà voté pour la proposition
            await voteBDD.creer(idProposition, nomProposition, <string>utilisateur._id);
    }
    await utile.majDesign(interaction.message, sondage);
}