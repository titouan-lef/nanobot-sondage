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
        console.log("clé", JSON.stringify(cleUtilisateur));
        let str = await schema.findById(cleUtilisateur);
        console.log("utilisateur trouvé", JSON.stringify(str));
        str = await schema.findById(cleUtilisateur, 'nom');
        console.log("utilisateur trouvé avec nom", JSON.stringify(str));
        return await schema.findById(cleUtilisateur).nom;
    },

    supprimerTous: async (idSondage) => {
        await schema.deleteMany({
            id_sondage: idSondage
        });
    }
};