const voteBDD = require("../../bdd/vote.js");

module.exports = {
    messageVote: (cleUtilisateur) =>
    {
        let message = "";

        const tabVote = voteBDD.trouverTous(cleUtilisateur);

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