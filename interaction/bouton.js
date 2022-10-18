module.exports = async (interaction) => { 
    let tabSondage = require("../variable/globale.js").getTabSondage();
    const fonction = require("../fonction/element/bouton.js");
    const objUser = require("../objet/utilisateur.js");

    const constante = require("../variable/constante.js");
    const idBoutonSupprime = constante.getIdBoutonSupprime();
    const idBoutonNotif = constante.getIdBoutonNotif();

    let idUser = interaction.user;
    let user;
    let sondage;

    tabSondage.forEach(sdg => {
        if (sdg.id === interaction.message.id)
        {
            sondage = sdg;
            return;
        }
    });

    sondage.tabUtilisateur.forEach(utilisateur => {
        if (utilisateur.id === idUser)
            user = utilisateur;
    });

    if (user === undefined)
    {
        user = objUser.nouveau(idUser, sondage.tabVote);
        sondage.tabUtilisateur.push(user);
    }

    if (interaction.customId === idBoutonNotif)
        interaction.user.send(fonction.messageVote(user));
    else
    {
        if (!sondage.choixMultiple || interaction.customId === idBoutonSupprime)
        {
            user.tabVote.forEach(vote => {
                if (vote.id === interaction.customId)
                    vote.nbVote = 1;
                else
                    vote.nbVote = 0;
            });
        }
        else
        {
            user.tabVote.forEach(vote => {
                if (vote.id === interaction.customId)
                {
                    vote.nbVote = 1;
                    return;
                }
            });
        }
    }

    await interaction.deferUpdate();
}; 