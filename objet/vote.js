module.exports = {
    nouveau: (idVote, nomProposition) =>
    {
        return {
            id : idVote, //Lettre qui défini le vote
            proposition : nomProposition,
            nbVote : 0
        };
    }
};