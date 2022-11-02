const schema = require("./schema/vote.js");

module.exports =
{
    creer: async (idVote, nomProposition, _cle_utilisateur) => {
        const vote = {
            id_vote : idVote, //Lettre qui défini le vote
            proposition : nomProposition,
            nb_vote : 1,
            cle_utilisateur: _cle_utilisateur
        };

        await new schema(vote).save();
    },

    trouverTous: async (cleUtilisateur) => {
        return await schema.find({
            cle_utilisateur: cleUtilisateur
        });
    },
    
    trouverPropositionTabVote: async (idVote, tabCleUtilisateurBDD) => {
        let tabCleUtilisateur = [];
        tabCleUtilisateurBDD.forEach(cleUtilisateur => tabCleUtilisateur.push(cleUtilisateur._id));

        return await schema.find({
            id_vote: idVote,
            cle_utilisateur: { $in: tabCleUtilisateur },
            nb_vote: 1
        });
    },

    supprimerTous: async (cleUtilisateur) => {
        await schema.deleteMany({
            cle_utilisateur: cleUtilisateur
        });
    },

    trouverProposition: async (cleUtilisateur, idVote) => {
        return await schema.findOne({
            cle_utilisateur: cleUtilisateur,
            id_vote: idVote
        });
    }
};