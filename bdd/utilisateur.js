const schema = require("./schema/utilisateur.js");

module.exports =
{
    creer: async (_id_utilisateur, _nom, _id_sondage) => {
        const utilisateur = {
            id_utilisateur: _id_utilisateur,
            nom: _nom,
            id_sondage: _id_sondage
        };

        return await new schema(utilisateur).save();
    },

    trouver: async (idSondage, idUser) => {
        return await schema.findOne({
            id_sondage: idSondage,
            id_utilisateur: idUser
        });
    },

    trouverTousCle: async (idSondage) => {
        return await schema.find({
            id_sondage: idSondage
        }, '_id');
    },

    trouverNom: async (cleUtilisateur) => {
        let utilisateur = await schema.findById(cleUtilisateur, 'nom');
        return utilisateur.nom;
    },

    getNbUtilisateur: async (idSondage) => {
        let tabUtilisateur = await schema.find({
            id_sondage: idSondage
        });

        return tabUtilisateur.length;
    },

    supprimerTous: async (idSondage) => {
        await schema.deleteMany({
            id_sondage: idSondage
        });
    },

    supprimer: async (idSondage, idUtilisateur) => {
        await schema.deleteOne({
            id_utilisateur: idUtilisateur,
            id_sondage: idSondage
        });
    }
};