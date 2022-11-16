import { ChatInputCommandInteraction } from "discord.js";

import fonction from "../fonction/commande/sondage";

export default
{
    sondage: async (interaction: ChatInputCommandInteraction): Promise<void> =>
    {
        // Récupération des variables
        const question: string = <string> interaction.options.getString("question");

        const temps: number = <number> interaction.options.getInteger("temps");
        const mesure: string = <string> interaction.options.getString("mesure");
        const choixMultiple: boolean = <boolean> interaction.options.getBoolean("choix_multiple");
        
        const listeProposition: string[] = fonction.getProposition(interaction);

        const role1: string = interaction.options.getRole("role1")? <string> interaction.options.getRole("role1")?.toString() : '';
        const role2: string = interaction.options.getRole("role2")? <string> interaction.options.getRole("role2")?.toString() : '';

        const montrer: boolean = (!interaction.options.getBoolean("montrer") ? false : true);
        const ajout: boolean = (!interaction.options.getBoolean("ajout") ? false : true);
        const rappel: boolean = (!interaction.options.getBoolean("rappel") ? false : true);
        
        await fonction.creerSonsage(interaction, question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer, ajout, rappel);
    },

    sondage_rdva: async (interaction: ChatInputCommandInteraction): Promise<void> =>
    {
        // Récupération des variables
        const question: string = "Vote pour le prochain thème du RDV des artistes";

        const temps: number = <number> interaction.options.getInteger("temps");
        const mesure: string = <string> interaction.options.getString("mesure");
        const choixMultiple: boolean = false;
        
        const listeProposition: string[] = fonction.getProposition(interaction);

        const role1: string = <string> process.env.ID_ROLE_ARTISTE;
        const role2: string = '';

        const montrer: boolean = false;
        const ajout: boolean = false;
        const rappel: boolean = true;
        
        await fonction.creerSonsage(interaction, question, temps, mesure, choixMultiple, listeProposition, role1, role2, montrer, ajout, rappel);
    }
};