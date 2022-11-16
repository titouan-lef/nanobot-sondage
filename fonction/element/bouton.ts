import { Utilisateur } from "../../interface/Utilisateur";
import { Vote, VoteBDD } from "../../interface/Vote";
const voteBDD = new VoteBDD();

export default
{
    messageVote: async (utilisateur: Utilisateur): Promise<string> =>
    {
        let message: string = "";

        if (utilisateur._id)
        {
            const tabVote: Vote[] = await voteBDD.trouverTous(utilisateur._id);
    
            tabVote.forEach(vote => {
                if (vote.nb_vote === 1)
                    message += "\n" + vote.proposition;
            })
        }

        if (message === "")
            return "Vous n'avez pas voté";
        else
            return "Vous avez voté pour :" + message;
    }
};