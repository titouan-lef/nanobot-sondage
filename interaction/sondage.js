module.exports = (interaction) =>
{   
    const fonction = require("../fonction/commande/sondage.js");

    // Récupération des variables
    const question = interaction.options.getString("question");

    const temps = interaction.options.getInteger("temps");
    const mesure = interaction.options.getString("mesure");
    const choixMultiple = interaction.options.getBoolean("choix_multiple");
    
    const listeProposition = fonction.getProposition(interaction);

    const role1 = interaction.options.getRole("role1");
    const role2 = interaction.options.getRole("role2");

    const montrer = interaction.options.getBoolean("montrer");
    
    fonction.creerSonsage(question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer);
};