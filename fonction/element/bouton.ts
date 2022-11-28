import { IUtilisateur } from "../../interface/Utilisateur";
import { Vote, IVote } from "../../interface/Vote";

export default
{
    messageVote: async (utilisateur: IUtilisateur | null): Promise<string> =>
    {
        let message: string = "";

        if (utilisateur?._id)
        {
            const tabVote: IVote[] = await Vote.trouverTous(utilisateur._id);
    
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