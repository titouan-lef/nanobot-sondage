module.exports = {
    nouveau: (idVote, nomProposition) =>
    {
        return {
            id_vote : idVote, //Lettre qui défini le vote
            proposition : nomProposition,
            nb_vote : 0
        };
    }
};