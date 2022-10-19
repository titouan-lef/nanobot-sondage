const fonction = require("../fonction/utile.js");

module.exports = (message) => {
    console.log(message);
    if (message.type === "REPLY")
    {
        console.log("message trouvé");
        let idOriginalMessage = message.reference.messageId;
        let idSondage = fonction.trouverIndexSondage(idOriginalMessage);
        if (idSondage !== -1)
        {
            console.log("sondage trouvé");
            require("../fonction/autre/ajoutOption.js").ajoutOption(message.channel, idSondage, message.content);
            console.log("ça marche");
        }
    }
};