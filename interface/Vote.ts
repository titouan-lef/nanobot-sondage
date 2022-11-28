import { Model, Schema, model, ObjectId } from 'mongoose';
import req from "./Req";
import { IUtilisateur } from "./Utilisateur";

// Champ
export interface IVote {
    _id: ObjectId,
    id_vote : string, //Lettre qui défini le vote
    proposition : string,
    nb_vote : number,
    cle_utilisateur: ObjectId
};

// Methode
interface VoteModel extends Model<IVote> {
    trouverTous(cleUtilisateur: ObjectId): Promise<IVote[]>,
    trouverPropositionTabVote(idVote: string, tabCleUtilisateurBDD: IUtilisateur[]): Promise<IVote[]>,
    supprimerTous(cleUtilisateur: ObjectId): Promise<Object>,
    trouverProposition(cleUtilisateur: ObjectId, idVote: string): Promise<IVote | null>
};
  
// SCHEMA - Champ
const schema = new Schema<IVote, VoteModel>({
    _id: req.getObjectVide(),
    id_vote: req.getString(),
    proposition: req.getString(),
    nb_vote: req.getNumber(),
    cle_utilisateur: req.getString()// Clé étrangère
});

// SCHEMA - Méthode
schema.static('trouverTous', async function (cleUtilisateur: ObjectId): Promise<IVote[]>
{
    return Vote.find({
        cle_utilisateur: cleUtilisateur
    }).exec();
});

schema.static('trouverPropositionTabVote', async function (idVote: string, tabCleUtilisateurBDD: IUtilisateur[]): Promise<IVote[]>
{
    let tabCleUtilisateur: ObjectId[] = [];
    tabCleUtilisateurBDD.forEach(cleUtilisateur => {
        if (cleUtilisateur._id !== undefined)
            tabCleUtilisateur.push(cleUtilisateur._id);
    });

    return Vote.find({
        id_vote: idVote,
        cle_utilisateur: { $in: tabCleUtilisateur },
        nb_vote: 1
    }).exec();
});

schema.static('supprimerTous', async function (cleUtilisateur: ObjectId): Promise<Object>
{
    return Vote.deleteMany({
        cle_utilisateur: cleUtilisateur
    }).exec();
});

schema.static('trouverProposition', async function (cleUtilisateur: ObjectId, idVote: string): Promise<IVote | null>
{
    return Vote.findOne({
        cle_utilisateur: cleUtilisateur,
        id_vote: idVote
    }).exec();
});

// EXPORTATION
export const Vote = model<IVote, VoteModel>('Vote', schema);