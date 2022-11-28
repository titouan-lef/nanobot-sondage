import { Model, Schema, model, ObjectId } from 'mongoose';
import { EmbedBuilder } from "@discordjs/builders";
import req from "./Req";
import { Proposition } from "./Proposition";

// Champ
export interface ISondage {
    _id: ObjectId,
    id_sondage: string,
    question: string,
    choix_multiple: boolean,
    montrer: boolean,
    ajout: boolean,
    rappel: boolean,
    proposition_valide: Proposition,
    tag: string,
    texte: string,
    design_sondage: EmbedBuilder,
    minuteur: number
};

// Methode
interface SondageModel extends Model<ISondage> {
    trouver(idSondage: string): Promise<ISondage | null>,
    supprimer(idSondage: string): Promise<Object>,
    updatePropositionValideEtEmbed(idSondage: string, propositionValide: Proposition, embed: EmbedBuilder): Promise<ISondage | null>,
    updateEmbed(idSondage: string, embed: EmbedBuilder): Promise<ISondage | null>
};
  
// SCHEMA - Champ
const schema = new Schema<ISondage, SondageModel>({
    _id: req.getObjectVide(),
    id_sondage: req.getString(),
    question: req.getString(),
    choix_multiple: req.getBoolean(),
    montrer: req.getBoolean(),
    ajout: req.getBoolean(),
    rappel: req.getBoolean(),
    proposition_valide: req.getObject(),
    tag: req.getStringVide(),
    texte: req.getStringVide(),
    design_sondage: req.getObject(),
    minuteur: req.getNumber()
});

// SCHEMA - Méthode
schema.static('trouver', async function (idSondage: string): Promise<ISondage | null>
{
    return Sondage.findOne({
        id_sondage: idSondage
    }).exec();
});

schema.static('supprimer', async function (idSondage: string): Promise<Object>
{
    return Sondage.deleteOne({
        id_sondage: idSondage
    }).exec();
});

schema.static('updatePropositionValideEtEmbed', async function (idSondage: string, propositionValide: Proposition, embed: EmbedBuilder): Promise<ISondage | null>
{
    return Sondage.findOneAndUpdate({id_sondage: idSondage},
        {proposition_valide: propositionValide, design_sondage: embed}).exec();
});

schema.static('updateEmbed', async function  (idSondage: string, embed: EmbedBuilder): Promise<ISondage | null>
{
    return Sondage.findOneAndUpdate({id_sondage: idSondage},
        {design_sondage: embed}).exec();
});

// EXPORTATION
export const Sondage = model<ISondage, SondageModel>('Sondage', schema);