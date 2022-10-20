const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

let tabSondage = require("../variable/globale.js").getTabSondage();

const constante = require("../variable/constante.js");
const alphabet = constante.getAlphabet();
const idBoutonSupprime = constante.getIdBoutonSupprime();
const nomBoutonSupprime = constante.getNomBoutonSupprime();
const idBoutonNotif = constante.getIdBoutonNotif();
const nomBoutonNotif = constante.getNomBoutonNotif();
const idBoutonArreter = constante.getIdBoutonArreter();
const nomBoutonArreter = constante.getNomBoutonArreter();

module.exports =
{
    setDescription: (listePropositionValide) =>
    {
        let description = "";

        for (let i = 0; i < listePropositionValide.length; ++i)
            description += getPropositionDescription(alphabet[i], listePropositionValide[i]);

        return description;
    },

    creerTabBouton: (listePropositionValide, temps) =>
    {
        let tab = [];
        let ligneBouton;
        for (let i = 0; i < listePropositionValide.length; ++i)
        {
            if (i % 5 === 0)
            {
                if (i !== 0)
                    tab.push(ligneBouton);
                
                ligneBouton = new ActionRowBuilder();
            }
            
            ligneBouton.addComponents(
                new ButtonBuilder()
                    .setCustomId(alphabet[i])
                    .setLabel(alphabet[i])
                    .setStyle(ButtonStyle.Primary));
        }
        tab.push(ligneBouton);
    
        //BOUTON : Bouton pour supprimer son vote et un bouton pour recevoir une notif
        ligneBouton = creerBoutonSuppEtNotif();
    
        //BOUTON : Bouton pour arreter le sondage
        if (temps === 0)
            ligneBouton.addComponents(
                    new ButtonBuilder()
                        .setCustomId(idBoutonArreter)
                        .setLabel(nomBoutonArreter)
                        .setStyle(ButtonStyle.Success));
    
        tab.push(ligneBouton);
    
        return tab;
    },

    finSondage: async (interaction, message) =>
    {
        try {
            await message.delete();
        } catch (error) {
            console.log("Le sondage a été supprimé par quelqu'un");
        }

        let i = trouverIndexSondage(message.id);
        let sondage = tabSondage[i];
        let titreFin = "Sondage : " + sondage.param.question + " (Terminé)";
        let description = afficherResultat(message);
        let designFinSondage = creerDesignSondage("#0000FF", titreFin, description, sondage.param.designSondage.data.footer.text);
        interaction.channel.send({content: sondage.param.tag, embeds: [designFinSondage]});
        
        for (const [, user] of Object.entries(sondage.tabUtilisateur))
            console.log(user.id.username);
        
        tabSondage.splice(i, 1);//Suppression du sondage
        
        console.log(tabSondage);
    },

    rappel: async (interaction, tag) =>
    {
        let texte;

        if (tag)
            texte = tag + "\n";
        else
            texte = "";
        
        texte += "Attention le sondage finit dans une heure !"

        await interaction.channel.send({content: texte});
    },

    creerDesignSondage: (couleur, titreSondage, descriptionSondage, footer) =>
    {
        return creerDesignSondage(couleur, titreSondage, descriptionSondage, footer);
    },

    trouverIndexSondage: (idSondage) =>
    {
        return trouverIndexSondage(idSondage);
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

        description += "**" + vote.proposition + "** : " + vote.nbVote + stringVote;

        if (sondage.param.montrer && vote.votant !== "")
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
    return -1;
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

function getPropositionDescription(lettreProposition, proposition)
{
    let description = "";

    if (lettreProposition !== "A")
        description = "\n";
    
    return description + "`" + lettreProposition + ")` **" + proposition + "**";
}

function creerBoutonSuppEtNotif()
{
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idBoutonSupprime)
                .setLabel(nomBoutonSupprime)
                .setStyle(ButtonStyle.Danger))
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idBoutonNotif)
                .setLabel(nomBoutonNotif)
                .setStyle(ButtonStyle.Secondary));
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