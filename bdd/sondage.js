const schema = require("./schema/sondage.js");

module.exports =
{
    creer: async (_id_sondage, _question, _choix_multiple, _montrer, _ajout, _rappel, _propositionValide, _tag, _texte, _design_sondage, _minuteur) => {
        const sondage = {
            id_sondage: _id_sondage,
            question: _question,
            choix_multiple: _choix_multiple,
            montrer: _montrer,
            ajout: _ajout,
            rappel: _rappel,
            proposition_valide: _propositionValide,
            tag: _tag,
            texte: _texte,
            design_sondage: _design_sondage,
            minuteur: _minuteur
        };

        await new schema(sondage).save();

        return sondage;
    },

    trouver: async (idSondage) => {
        return await schema.findOne({
            id_sondage: idSondage
        });
    },

    supprimer: async (idSondage) => {
        await schema.deleteOne({
            id_sondage: idSondage
        });
    }
};