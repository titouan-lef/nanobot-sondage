import { Model, Schema, model, ObjectId } from 'mongoose';
import req from "./Req";

// Champ
export interface IUtilisateur {
    _id: ObjectId,
    id_utilisateur: string,
    nom: string,
    id_sondage: string
};

// Methode
interface UtilisateurModel extends Model<IUtilisateur> {
    trouver(idSondage: string, idUser: string): Promise<IUtilisateur | null>,
    trouverTous(idSondage: string): Promise<IUtilisateur[]>,
    trouverNom(cleUtilisateur: ObjectId): Promise<string>,
    getNbUtilisateur(idSondage: string): Promise<number>,
    supprimerTous(idSondage: string): Promise<Object>,
    supprimer(idSondage: string, idUtilisateur: string): Promise<Object>
};
  
// SCHEMA - Champ
const schema = new Schema<IUtilisateur, UtilisateurModel>({
    _id: req.getObjectVide(),
    id_utilisateur: req.getString(),
    nom: req.getString(),
    id_sondage: req.getString()// Clé étrangère
});

// SCHEMA - Méthode
schema.static('trouver', async function (idSondage: string, idUser: string): Promise<IUtilisateur | null>
{
    return Utilisateur.findOne({
        id_sondage: idSondage,
        id_utilisateur: idUser
    }).exec();
});


    
schema.static('trouverTous', async function (idSondage: string): Promise<IUtilisateur[]>
{
    return Utilisateur.find({
        id_sondage: idSondage
    }).exec();
});

schema.static('trouverNom', async function (cleUtilisateur: ObjectId): Promise<string>
{
    let utilisateur: IUtilisateur | null = await Utilisateur.findById(cleUtilisateur, 'nom').exec();
    return utilisateur ? utilisateur.nom : "";
});

schema.static('getNbUtilisateur', async function (idSondage: string): Promise<number>
{
    let tabUtilisateur: IUtilisateur[] = await Utilisateur.find({
        id_sondage: idSondage
    }).exec();

    return tabUtilisateur.length;
});

schema.static('supprimerTous', async function (idSondage: string): Promise<Object>
{
    return Utilisateur.deleteMany({
        id_sondage: idSondage
    }).exec();
});

schema.static('supprimer', async function (idSondage: string, idUtilisateur: string): Promise<Object>
{
    return Utilisateur.deleteOne({
        id_utilisateur: idUtilisateur,
        id_sondage: idSondage
    }).exec();
});

// EXPORTATION
export const Utilisateur = model<IUtilisateur, UtilisateurModel>('Utilisateur', schema);