import mongo from "mongoose";
import req from "./Req";

// CHAMPS
export interface Utilisateur
{
    _id?: string,
    id_utilisateur: string,
    nom: string,
    id_sondage: string
}

// METHODE
interface UtilisateurMethode
{
    creer(_id_utilisateur: string, _nom: string, _id_sondage: string): Promise<Utilisateur>;
    trouver(idSondage: string, idUser: string): Promise<Utilisateur>;
    trouverTous(idSondage: string): Promise<Utilisateur[]>;
    trouverNom(cleUtilisateur: string): Promise<string>;
    getNbUtilisateur(idSondage: string): Promise<number>;
    supprimerTous(idSondage: string): Promise<Utilisateur[]>;
    supprimer(idSondage: string, idUtilisateur: string): Promise<Utilisateur>;
}

type UtilisateurModel = mongo.Model<Utilisateur, {}, UtilisateurMethode>;

// SCHEMA : Initialisation
const utilisateurSchema: mongo.Schema<Utilisateur, UtilisateurModel, UtilisateurMethode> = new mongo.Schema<Utilisateur, UtilisateurModel, UtilisateurMethode>({
    id_utilisateur: req.getString(),
    nom: req.getString(),
    id_sondage: req.getString()// Clé étrangère
});

// SCHEMA : Méthodes
utilisateurSchema.methods.creer = async function (_id_utilisateur: string, _nom: string, _id_sondage: string): Promise<Utilisateur>
{
    return new mongo.Model<Utilisateur>({
        id_utilisateur: _id_utilisateur,
        nom: _nom,
        id_sondage: _id_sondage
    }).save();
};

utilisateurSchema.methods.trouver = async function (idSondage: string, idUser: string): Promise<Utilisateur>
{
    return this.findOne({
        id_sondage: idSondage,
        id_utilisateur: idUser
    }).exec();
};

utilisateurSchema.methods.trouverTous = async function (idSondage: string): Promise<Utilisateur[]>
{
    return this.find({
        id_sondage: idSondage
    }).exec();
};

utilisateurSchema.methods.trouverNom = async function (cleUtilisateur: string): Promise<string>
{
    return this.findById(cleUtilisateur, 'nom').exec().nom;
};

utilisateurSchema.methods.getNbUtilisateur = async function (idSondage: string): Promise<number>
{
    let tabUtilisateur: Utilisateur[] = await this.find({
        id_sondage: idSondage
    }).exec();

    return tabUtilisateur.length;
};

utilisateurSchema.methods.supprimerTous = async function (idSondage: string): Promise<Utilisateur[]>
{
    return this.deleteMany({
        id_sondage: idSondage
    }).exec();
};

utilisateurSchema.methods.supprimer = async function (idSondage: string, idUtilisateur: string): Promise<Utilisateur>
{
    return this.deleteOne({
        id_utilisateur: idUtilisateur,
        id_sondage: idSondage
    }).exec();
};

// EXPORTATION
export const UtilisateurBDD = mongo.model<Utilisateur, UtilisateurModel>('Utilisateur', utilisateurSchema);