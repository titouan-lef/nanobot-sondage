import { Message } from "discord.js";

import fonction from "../fonction/autre/reponse";

import { Sondage, ISondage } from "../interface/Sondage";

export default async (message: Message): Promise<void> =>
{
    if (message.type === 19)
    {
        let idSondage: string = <string> message.reference?.messageId;
        let sondage: ISondage | null = await Sondage.trouver(idSondage);
        
        if (sondage !== null)
        {
            if ("#" + sondage._id === message.content)
                await fonction.forcerArret(message, sondage);
            else
                await fonction.ajoutOption(message, sondage);
        }
    }
};