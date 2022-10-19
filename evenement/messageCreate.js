const fonction = require("../fonction/utile.js");

module.exports = (message) =>
{
    if (message.type === 19)
    {
        let idOriginalMessage = message.reference.messageId;
        let idSondage = fonction.trouverIndexSondage(idOriginalMessage);
        
        if (idSondage !== -1)
            require("../fonction/autre/ajoutOption.js").ajoutOption(message.channel, idSondage, message.content);
    }
};