const voteBDD = require("../../bdd/vote.js");

module.exports = {
    messageVote: async (cleUtilisateur) =>
    {
        let message = "";

        const tabVote = await voteBDD.trouverTous(cleUtilisateur);
        console.log(JSON.stringify(tabVote));

        tabVote.forEach(vote => {
            if (vote.nb_vote === 1)
                message += "\n" + vote.proposition;
        })

        if (message === "")
            return "Vous n'avez pas voté";
        else
            return "Vous avez voté pour :" + message;
    }
};