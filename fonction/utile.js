let tabSondage = require("../../variable/globale.js").getTabSondage();

module.exports =
{
    finSondage: (interaction, message) =>
    {
        message.delete();
        let sondage = tabSondage[trouverIndexSondage(message.id)];
        let titreFin = "Sondage : " + sondage.question + " (Terminé)";
        let description = afficherResultat(message);
        let designFinSondage = creerDesignSondage("#0000FF", titreFin, description, sondage.footer);
        interaction.channel.send({content: sondage.tag, embeds: [designFinSondage]});
        tabSondage.splice(trouverIndexSondage(message.id), 1);//Suppression du sondage
        console.log(tabSondage);
    }
};


function afficherResultat(message)
{
    let description = "";
    let stringVote;
    let sondage = tabSondage[trouverIndexSondage(message.id)];
    let premierPassage = true;

    calculerNbVote(sondage);
    
    triInsertion(sondage.tabVote);

    sondage.tabVote.forEach(vote => {
        if (premierPassage)
            premierPassage = false;
        else
            description += "\n";
        
        if (vote.nbVote === 0 || vote.nbVote === 1)
            stringVote = " vote";
        else
            stringVote = " votes";

        description += "`" + vote.id + ")` **" + vote.proposition + "** : " + vote.nbVote + stringVote;

        if (sondage.montrer && vote.votant !== "")
            description += " (" + vote.votant + ")";
    });

    return description;
}

function trouverIndexSondage(idSondage)
{
    for (let i = 0; i < tabSondage.length; i++)
    {
        if (tabSondage[i].id === idSondage)
            return i;
    }
    console.log("sondage " + idSondage + " introuvable");
}

function calculerNbVote(sondage)
{
    let premierPassage;
    let listeUser;

    for (let i = 0; i < sondage.tabVote.length; i++)
    {
        premierPassage = true;
        listeUser = "";

        for (let j = 0; j < sondage.tabUtilisateur.length; j++)
        {
            if (sondage.tabUtilisateur[j].tabVote[i].nbVote === 1)
            {
                ++sondage.tabVote[i].nbVote;
                
                if (premierPassage)
                    premierPassage = false;
                else
                    listeUser += ", ";

                listeUser += sondage.tabUtilisateur[j].id.username;
            }
        }

        sondage.tabVote[i]["votant"] = listeUser;
    }
}

function triInsertion(tabVote)
{
    let tmp, j;                  
    
    for(i = 1; i < tabVote.length; i++)
    {
        //stocker la valeur actuelle 
        tmp = tabVote[i]
        j = i - 1
        while (j >= 0 && tabVote[j].nbVote < tmp.nbVote)
        {
            // déplacer le nombre
            tabVote[j+1] = tabVote[j]
            j--
        }
        //Insère la valeur temporaire à la position correcte dans la partie triée.
        tabVote[j+1] = tmp
    }
}

function creerDesignSondage(couleur, titreSondage, descriptionSondage, footer)
{
    return new EmbedBuilder()
        .setColor(couleur)
        .setTitle(titreSondage)
        .setDescription(descriptionSondage)
        .setTimestamp()
        .setFooter({text: footer});
}