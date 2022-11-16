import fonction from "../utile";

import constante from "../../variable/constante";
const alphabet: string[] = constante.getAlphabet();

import { EmbedBuilder, Message } from "discord.js";
import { Proposition } from "../../interface/Proposition";

import { Sondage, SondageBDD } from "../../interface/Sondage";
const sondageBDD = new SondageBDD();

export default
{
    forcerArret: async (message: Message, sondage: Sondage): Promise<void> =>
    {
        if (sondage.tag)
            sondage.tag += "\n:warning: Le sondage a été arrêté de force par " + message.author.username;
        else
            sondage.tag = ":warning: Le sondage a été arrêté de force par " + message.author.username;

        let messageSondage: Message = await message.channel.messages.fetch(sondage.id_sondage);

        try {
            await message.delete();
        } catch (error) {
            console.log("Le message d'arrêt a été supprimé par quelqu'un");
        }

        await fonction.finSondage(messageSondage, sondage);
    },

    ajoutOption: async (messageProposition: Message, sondage: Sondage): Promise<void> =>
    {
        if (sondage.ajout)
        {
            let channel = messageProposition.channel;
            let proposition: string = messageProposition.content;
            let propositionValide: Proposition = sondage.proposition_valide;
            let nbProposition: number = Object.keys(propositionValide).length;

            if (nbProposition < alphabet.length)
            {
                try {
                    await messageProposition.delete();// Supression du message qui ajoute une proposition
                } catch (error) {
                    console.log("Le sondage a été supprimé par quelqu'un");
                }
                
                propositionValide[alphabet[nbProposition]] = proposition;// Ajout de la nouvelle proposition

                let designSondage: EmbedBuilder = sondage.design_sondage;
                designSondage.data.description = fonction.setDescription(propositionValide);

                let message: Message = await channel.messages.fetch(sondage.id_sondage);

                await fonction.majDesign(message, sondage);

                await sondageBDD.updatePropositionValideEtEmbed(sondage.id_sondage, propositionValide, designSondage);
            }
            else
                console.log("le nombre maximum de proposition est déjà atteint");
        }
    }
};