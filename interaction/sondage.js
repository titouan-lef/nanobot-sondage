module.exports = async (interaction) => {   
    let tabSondage = require("../variable/globale.js").getTabSondage();
    const fonction = require("../fonction/commande/sondage.js");
    const objSondage = require("../objet/sondage.js");

    // Récupération des variables
    const question = interaction.options.getString("question");

    const temps = interaction.options.getInteger("temps");
    const mesure = interaction.options.getString("mesure");
    const choixMultiple = interaction.options.getBoolean("choix_multiple");
    
    let listeProposition = fonction.getProposition(interaction);

    const role1 = interaction.options.getRole("role1");
    const role2 = interaction.options.getRole("role2");

    const montrer = interaction.options.getBoolean("montrer");
    
    // Paramétrage des variables liées au sondage
    let listePropositionValide = fonction.getPropositionValide(listeProposition);
    let descriptionSondage = fonction.setDescription(listePropositionValide);
    
    let tag = fonction.creerTag(role1, role2);
    
    let avertissement = fonction.creerAvertissement(montrer);
    
    let texte;
    if (tag && avertissement)
        texte = tag + "\n" + avertissement;
    else
    {
        if (tag)
            texte = tag;
        else
            texte = avertissement;
    }

    // Création du design du sondage
    let titreSondage = "Sondage : " + question + " (fin dans : " + fonction.finSondageDans(temps, mesure) + ")";
    let footer = fonction.creerFooter(choixMultiple);
    const designSondage = fonction.creerDesignSondage("FF0000", titreSondage, descriptionSondage, footer);

    // Bouton pour voter
    let tabBouton = fonction.creerTabBouton(listePropositionValide, temps);

    // Envoie du sondage dans le channel
    let envoi = await interaction.channel.send({content: texte, embeds: [designSondage], components: tabBouton});

    // Ajout du sondage au tableau
    tabSondage.push(objSondage.nouveau(envoi.id, listePropositionValide, question, footer, tag, choixMultiple, montrer));

    // Paramétrage de la fin du sondage
    fonction.initFinSondage(interaction, envoi, temps, mesure);

    await interaction.reply({ content: 'Commande réussite', ephemeral: true });
};