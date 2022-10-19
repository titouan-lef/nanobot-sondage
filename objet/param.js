module.exports = {
    nouveau: (question, temps, mesure, boolChoixMultiple, boolMontrer, listePropositionValide, roles, texte, designSondage) =>
    {
        let VMinuteur = minuteur(mesure, temps);

        return {question : question,
            choixMultiple : boolChoixMultiple,
            montrer : boolMontrer,
            propositionValide : listePropositionValide,
            tag : roles,
            texte : texte,
            designSondage : designSondage,
            minuteur : VMinuteur
        };
    }
};

function minuteur(mesure, temps)
{
    switch (mesure)
    {
        case "jour":
            return temps * 1000 * 60 * 60 * 24;
        case "heure":
            return temps * 1000 * 60 * 60;
        case "minute":
            return temps * 1000 * 60;
        default:
            console.log("erreur sur la durée du sondage");
            return;
    }
}