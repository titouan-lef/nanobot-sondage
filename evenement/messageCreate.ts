import { Message } from "discord.js";

import fonction from "../fonction/autre/reponse";

import { Sondage, SondageBDD } from "../interface/Sondage";
const sondageBDD = new SondageBDD();

export default async (message: Message): Promise<void> =>
{
    if (message.type === 19)
    {
        let idSondage: string = <string> message.reference?.messageId;
        let sondage: Sondage | null = await sondageBDD.trouver(idSondage);
        
        if (sondage !== null)
        {
            if ("#" + sondage._id === message.content)
                await fonction.forcerArret(message, sondage);
            else
                await fonction.ajoutOption(message, sondage);
        }
    }
};