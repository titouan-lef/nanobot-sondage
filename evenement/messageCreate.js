const fonction = require("../fonction/utile.js");

let tabSondage = require("../variable/globale.js").getTabSondage();

module.exports = (message) =>
{
    if (message.type === 19)
    {
        let idOriginalMessage = message.reference.messageId;
        let idSondage = fonction.trouverIndexSondage(idOriginalMessage);
        
        if (idSondage !== -1 && tabSondage[idSondage].param.ajout)
            require("../fonction/autre/ajoutOption.js").ajoutOption(message, tabSondage[idSondage]);     
    }
};