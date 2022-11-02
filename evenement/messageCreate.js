const fonction = require("../fonction/utile.js");

const sondageBDD = require("../bdd/sondage.js");

module.exports = (message) =>
{
    if (message.type === 19)
    {
        let idSondage = message.reference.messageId;
        let sondage = sondageBDD.trouver(idSondage);
        
        if (!sondage && sondage.ajout)
            require("../fonction/autre/ajoutOption.js").ajoutOption(message, sondage);
    }
};