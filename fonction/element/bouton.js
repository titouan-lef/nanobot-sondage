const fonction = require("../utile.js");

const voteBDD = require("../../bdd/vote.js");
const utilisateurBDD = require("../../bdd/utilisateur.js");

module.exports = {
    messageVote: async (utilisateur) =>
    {
        let message = "";

        if (utilisateur)
        {
            const tabVote = await voteBDD.trouverTous(utilisateur._id);
    
            tabVote.forEach(vote => {
                if (vote.nb_vote === 1)
                    message += "\n" + vote.proposition;
            })
        }

        if (message === "")
            return "Vous n'avez pas voté";
        else
            return "Vous avez voté pour :" + message;
    },

    majNbVotant: async (interaction, sondage) =>
    {
        let designSondage = sondage.design_sondage;
        
        designSondage.data.footer.text = await fonction.creerFooter(sondage.choix_multiple);

        await fonction.majDesign(interaction.message, sondage.proposition_valide, sondage.minuteur, sondage.texte, designSondage);
    }
};