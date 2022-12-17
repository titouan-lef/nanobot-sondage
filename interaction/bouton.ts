import fonction from "../fonction/element/bouton";
import utile from "../fonction/utile";

import constante from "../variable/constante";
const idBoutonSupprime = constante.getIdBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();

import { ButtonInteraction } from "discord.js";

import { Sondage, ISondage } from "../interface/Sondage";
import { Utilisateur, IUtilisateur } from "../interface/Utilisateur";
import { Vote, IVote } from "../interface/Vote";

export default async (interaction: ButtonInteraction): Promise<void> => {
    const idSondage: string = interaction.message.id;
    const idUtilisateur: string = interaction.user.id;
    const nomUtilisateur: string = interaction.user.username;

    let utilisateur: IUtilisateur | null = await Utilisateur.trouver(idSondage, idUtilisateur);// On cherche l'utilisateur qui a appuyé sur un bouton (celui-ci n'existe peut être pas)

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

async function interactionNotif(interaction: ButtonInteraction, utilisateur: IUtilisateur | null): Promise<void>
{
    let message: string = await fonction.messageVote(utilisateur)
    await interaction.user.send(message);
}

async function interactionArreter(interaction: ButtonInteraction, idSondage: string): Promise<void>
{
    await utile.finSondage(interaction.message);
}

async function interactionSupprimer(interaction: ButtonInteraction, idSondage: string, idUtilisateur: string, utilisateur: IUtilisateur | null): Promise<void>
{
    if (utilisateur)// Si l'utilisateur existe
    {
        await Vote.supprimerTous(utilisateur._id);
        await Utilisateur.supprimer(idSondage, idUtilisateur);

        let sondage: ISondage = <ISondage> await Sondage.trouver(idSondage);
        await utile.majDesign(interaction.message, sondage);
    }
}

async function interactionVote(interaction: ButtonInteraction, idSondage: string, idUtilisateur: string, nomUtilisateur: string, utilisateur: IUtilisateur | null): Promise<void>
{
    if (!utilisateur)// Si l'utilisateur n'existe pas
        utilisateur = await new Utilisateur({
            id_utilisateur: idUtilisateur,
            nom: nomUtilisateur,
            id_sondage: idSondage
        }).save();
    
    let sondage: ISondage = <ISondage> await Sondage.trouver(idSondage);

    let idProposition: string = interaction.customId;
    let nomProposition: string = sondage.proposition_valide[idProposition];

    if (!sondage.choix_multiple) // Choix unique
    {
        await Vote.supprimerTous(utilisateur._id);
        await new Vote({
            id_vote: idProposition,
            proposition: nomProposition,
            nb_vote: 1,
            cle_utilisateur: utilisateur._id
        }).save();
    }
    else // Choix multiple possible
    {
        let vote: IVote | null = await Vote.trouverProposition(utilisateur._id, idProposition);

        if (!vote) // Si la personnes n'a pas déjà voté pour la proposition
            await new Vote({
                id_vote: idProposition,
                proposition: nomProposition,
                nb_vote: 1,
                cle_utilisateur: utilisateur._id
            }).save();
    }
    await utile.majDesign(interaction.message, sondage);
}