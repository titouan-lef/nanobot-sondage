import mongo from "mongoose";
import req from "./Req";
import { Utilisateur } from "./Utilisateur";

// CHAMPS
export interface Vote
{
    _id?: string,
    id_vote : string, //Lettre qui défini le vote
    proposition : string,
    nb_vote : number,
    cle_utilisateur: string
}

// METHODE
interface VoteMethode
{
    creer(idVote: string, nomProposition: string, _cle_utilisateur: string): Promise<Vote>;
    trouverTous(cleUtilisateur: string): Promise<Vote[]>;
    trouverPropositionTabVote(idVote: string, tabCleUtilisateurBDD: Utilisateur[]): Promise<Vote[]>;
    supprimerTous(cleUtilisateur: string): Promise<Vote[]>;
    trouverProposition(cleUtilisateur: string, idVote: string): Promise<Vote>;
}

type VoteModel = mongo.Model<Vote, {}, VoteMethode>;

// SCHEMA : Initialisation
const voteSchema: mongo.Schema<Vote, VoteModel, VoteMethode> = new mongo.Schema<Vote, VoteModel, VoteMethode>({
    id_vote: req.getString(),
    proposition: req.getString(),
    nb_vote: req.getNumber(),
    cle_utilisateur: req.getString()// Clé étrangère
});

// SCHEMA : Méthodes
voteSchema.methods.creer = async function (idVote: string, nomProposition: string, _cle_utilisateur: string): Promise<Vote>
{
    return new mongo.Model<Vote>({
        id_vote : idVote, //Lettre qui défini le vote
        proposition : nomProposition,
        nb_vote : 1,
        cle_utilisateur: _cle_utilisateur
    }).save();
};

voteSchema.methods.trouverTous = async function (cleUtilisateur: string): Promise<Vote[]>
{
    return this.find({
        cle_utilisateur: cleUtilisateur
    }).exec();
};

voteSchema.methods.trouverPropositionTabVote = async function (idVote: string, tabCleUtilisateurBDD: Utilisateur[]): Promise<Vote[]>
{
    let tabCleUtilisateur: string[] = [];
    tabCleUtilisateurBDD.forEach(cleUtilisateur => {
        if (cleUtilisateur._id !== undefined)
            tabCleUtilisateur.push(cleUtilisateur._id.toString());
    });

    return this.find({
        id_vote: idVote,
        cle_utilisateur: { $in: tabCleUtilisateur },
        nb_vote: 1
    }).exec();
};

voteSchema.methods.supprimerTous = async function (cleUtilisateur: string): Promise<Vote[]>
{
    return this.deleteMany({
        cle_utilisateur: cleUtilisateur
    }).exec();
};

voteSchema.methods.trouverProposition = async function (cleUtilisateur: string, idVote: string): Promise<Vote>
{
    return this.findOne({
        cle_utilisateur: cleUtilisateur,
        id_vote: idVote
    }).exec();
};

// EXPORTATION
export const VoteBDD = mongo.model<Vote, VoteModel>('Vote', voteSchema);