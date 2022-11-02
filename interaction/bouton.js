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

    let utilisateur = await utilisateurBDD.trouver(idSondage, idUtilisateur);

    if (!utilisateur)
        utilisateur = await utilisateurBDD.creer(idUtilisateur, nomUtilisateur, idSondage);

    switch (interaction.customId)
    {
        case idBoutonNotif:
            interaction.user.send(fonction.messageVote(utilisateur._id));
            break;
        case idBoutonArreter:
            let sondage = await sondageBDD.trouver(idSondage);
            utile.finSondage(interaction, interaction.message, sondage);
            break;
        default:
            if (interaction.customId === idBoutonSupprime)
                await voteBDD.supprimerTous(utilisateur._id);
            else
            {
                let sondage = await sondageBDD.trouver(idSondage);

                let idProposition = interaction.customId;
                let nomProposition = sondage.proposition_valide[idProposition];

                if (!sondage.choix_multiple)
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
            }
            break;
    }

    await interaction.deferUpdate();
}; 