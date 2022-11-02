const schema = require("./schema/election.js");

module.exports =
{
    creer: async (idVote, nomProposition, _nb_vote, _votant, _id_sondage) => {
        const election = {
            id_vote : idVote, //Lettre qui défini le vote
            proposition : nomProposition,
            nb_vote : _nb_vote,
            votant: _votant,
            id_sondage: _id_sondage
        };

        await new schema(election).save();
    },

    supprimerTous: async (idSondage) => {
        await schema.deleteMany({
            id_sondage: idSondage
        });
    }
};