const fonction = require("../fonction/autre/reponse.js");

const sondageBDD = require("../bdd/sondage.js");

module.exports = async (message) =>
{
    if (message.type === 19)
    {
        let idSondage = message.reference.messageId;
        let sondage = await sondageBDD.trouver(idSondage);
        
        if (sondage)
        {
            if ("#" + sondage._id === message.content)
                fonction.forcerArret(message, sondage);
            else
                await fonction.ajoutOption(message, sondage);
        }
    }
};