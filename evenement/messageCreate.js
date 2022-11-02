const sondageBDD = require("../bdd/sondage.js");

module.exports = async (message) =>
{
    if (message.type === 19)
    {
        let idSondage = message.reference.messageId;
        let sondage = await sondageBDD.trouver(idSondage);
        
        if (sondage && sondage.ajout)
            await require("../fonction/autre/ajoutOption.js").ajoutOption(message, sondage);
    }
};