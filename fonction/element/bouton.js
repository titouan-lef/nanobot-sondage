module.exports = {
    messageVote: (user) =>
    {
        let message = "";

        user.tabVote.forEach(vote => {
            if (vote.nbVote === 1)
                message += "\n" + vote.proposition;
        })

        if (message === "")
            return "Vous n'avez pas voté";
        else
            return "Vous avez voté pour :" + message;
    }
};