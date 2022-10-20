const {SlashCommandBuilder} = require("discord.js");

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

module.exports = {
    sondage: () =>
    {
        let comm = new SlashCommandBuilder()
        .setName("sondage")
        .setDescription("Créer un sondage")
        
        .addStringOption(option => option.setName("question").setDescription("Question à poser").setRequired(true))

        .addIntegerOption(option => option.setName("temps").setDescription("Temps avant de révéler le sondage").setRequired(true))
        .addStringOption(option => option.setName("mesure").setDescription("Mesure liée au temps avant de révéler le sondage").setRequired(true)
                .addChoices(
                    { name: "Jour", value: "jour" },
                    { name: "Heure", value: "heure" },
                    { name: "Minute", value: "minute" }))

        .addBooleanOption(option => option.setName("choix_multiple").setDescription("Autoriser le choix multiple ?").setRequired(true));
        
        // Proposition obligatoire
        for (let i = 0; i < 2; i++)
            comm.addStringOption(option => option.setName(alphabet[i].toLowerCase()).setDescription("Proposition " + alphabet[i]).setRequired(true));

        // Proposition optionnelle
        for (let i = 2; i < alphabet.length; i++)
            comm.addStringOption(option => option.setName(alphabet[i].toLowerCase()).setDescription("Proposition " + alphabet[i]).setRequired(false));

        comm.addRoleOption(option => option.setName("role1").setDescription("Ping le rôle 1 donné").setRequired(false))
        .addRoleOption(option => option.setName("role2").setDescription("Ping le rôle 2 donné").setRequired(false))
        
        .addBooleanOption(option => option.setName("montrer").setDescription("Montrer qui a voté pour quoi à la fin ?").setRequired(false))

        .addBooleanOption(option => option.setName("ajout").setDescription("Possibilité d'ajouter des options pendant le sondage ?").setRequired(false))
        .addBooleanOption(option => option.setName("rappel").setDescription("Envoi un rappel 1h avant la fin du sondage ?").setRequired(false));

        return comm;
    },

    sondage_RDVA: () =>
    {
        let comm = new SlashCommandBuilder()
        .setName("sondage_RDVA")
        .setDescription("Créer un sondage pour le RDV des artistes");

        // Proposition obligatoire
        for (let i = 0; i < 5; i++)
            comm.addStringOption(option => option.setName(alphabet[i].toLowerCase()).setDescription("Proposition " + alphabet[i]).setRequired(true));

        comm.addIntegerOption(option => option.setName("temps").setDescription("Temps avant de révéler le sondage").setRequired(true))
        .addStringOption(option => option.setName("mesure").setDescription("Mesure liée au temps avant de révéler le sondage").setRequired(true)
                .addChoices(
                    { name: "Jour", value: "jour" },
                    { name: "Heure", value: "heure" },
                    { name: "Minute", value: "minute" }))
                    
        return comm;
    }
};