module.exports = {
    nouveau: (question, boolChoixMultiple, boolMontrer, boolAjout, boolRappel, listePropositionValide, vMinuteur, roles, texte, designSondage) =>
    {
        return {question : question,
            choixMultiple : boolChoixMultiple,
            montrer : boolMontrer,
            ajout : boolAjout,
            rappel : boolRappel,
            propositionValide : listePropositionValide,
            tag : roles,
            texte : texte,
            designSondage : designSondage,
            minuteur : vMinuteur
        };
    }
};