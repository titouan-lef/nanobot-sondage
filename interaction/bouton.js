const fonction = require("../fonction/element/bouton.js");
const utile = require("../fonction/utile.js");

const constante = require("../variable/constante.js");
const idBoutonSupprime = constante.getIdBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();

const sondageBDD = require("../bdd/sondage.js");
const utilisateurBDD = require("../bdd/utilisateur.js");
const voteBDD = require("../bdd/vote.js");

module.exports = async (interaction) => {
    const idSondage = interaction.message.id;
    const idUtilisateur = interaction.user.id;
    const nomUtilisateur = interaction.user.username;

    let utilisateur = await utilisateurBDD.trouver(idSondage, idUtilisateur);// On cherche l'utilisateur qui a appuyé sur un bouton (celui-ci n'existe peut être pas)

    switch (interaction.customId)
    {
        case idBoutonNotif:
            let message = await fonction.messageVote(utilisateur)
            await interaction.user.send(message);
            break;
        case idBoutonArreter:
            let sondage = await sondageBDD.trouver(idSondage);
            utile.finSondage(interaction.message, sondage);
            break;
        default:
            if (interaction.customId === idBoutonSupprime)
            {
                if (utilisateur)// Si l'utilisateur existe
                {
                    await voteBDD.supprimerTous(utilisateur._id);
                    await utilisateurBDD.supprimer(idSondage, idUtilisateur);

                    let sondage = await sondageBDD.trouver(idSondage);
                    await utile.majDesign(interaction.message, sondage);
                }
            }
            else
            {
                if (!utilisateur)// Si l'utilisateur n'existe pas
                    utilisateur = await utilisateurBDD.creer(idUtilisateur, nomUtilisateur, idSondage);
                
                let sondage = await sondageBDD.trouver(idSondage);

                let idProposition = interaction.customId;
                let nomProposition = sondage.proposition_valide[idProposition];

                if (!sondage.choix_multiple) // Choix unique
                {
                    await voteBDD.supprimerTous(utilisateur._id);
                    await voteBDD.creer(idProposition, nomProposition, utilisateur._id);
                }
                else // Choix multiple possible
                {
                    let vote = await voteBDD.trouverProposition(utilisateur._id, idProposition);

                    if (!vote) // Si la personnes n'a pas déjà voté pour la proposition
                        await voteBDD.creer(idProposition, nomProposition, utilisateur._id);
                }
                await utile.majDesign(interaction.message, sondage);
            }
            break;
    }

    await interaction.deferUpdate();
}; 