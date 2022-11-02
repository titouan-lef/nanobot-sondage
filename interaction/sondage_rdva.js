require("dotenv").config();

const fonction = require("../fonction/commande/sondage.js");

module.exports = async (interaction) =>
{
    // Récupération des variables
    const question = "Vote pour le prochain thème du RDV des artistes";

    const temps = interaction.options.getInteger("temps");
    const mesure = interaction.options.getString("mesure");
    const choixMultiple = false;
    
    const listeProposition = fonction.getProposition(interaction);

    const role1 = process.env.ID_ROLE_ARTISTE;
    const role2 = null;

    const montrer = false;
    const ajout = false;
    const rappel = true;
    
    await fonction.creerSonsage(interaction, question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer, ajout, rappel);
};