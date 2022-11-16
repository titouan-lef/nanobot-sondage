import { ChatInputCommandInteraction } from "discord.js";
import "dotenv/config";

import fonction from "../fonction/commande/sondage";

export default async (interaction: ChatInputCommandInteraction): Promise<void> =>
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
};