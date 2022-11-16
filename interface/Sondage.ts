import mongo from "mongoose";

import { EmbedBuilder } from "@discordjs/builders";

import { Proposition } from "./Proposition";
import req from "./Req"

// CHAMPS
export interface Sondage
{
    _id?: string,
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
}

// METHODE
interface SondageMethode
{
    creer(sondage: Sondage): Promise<Sondage>;
    trouver(idSondage: string): Promise<Sondage | null>;
    supprimer(idSondage: string): Promise<Sondage>;
    updatePropositionValideEtEmbed(idSondage: string, propositionValide: Proposition, embed: EmbedBuilder): Promise<Sondage>;
    updateEmbed(idSondage: string, embed: EmbedBuilder): Promise<Sondage>;
}

type SondageModel = mongo.Model<Sondage, {}, SondageMethode>;

// SCHEMA : Initialisation
const sondageSchema: mongo.Schema<Sondage, SondageModel, SondageMethode> = new mongo.Schema<Sondage, SondageModel, SondageMethode>({
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

// SCHEMA : Méthodes
sondageSchema.methods.creer = async function (sondage: Sondage): Promise<Sondage>
{
    return new mongo.Model<Sondage>(sondage).save();
};

sondageSchema.methods.trouver = async function (idSondage: string): Promise<Sondage | null>
{
    return this.findOne({
        id_sondage: idSondage
    }).exec();
};

sondageSchema.methods.supprimer = async function (idSondage: string): Promise<Sondage>
{
    return this.deleteOne({
        id_sondage: idSondage
    }).exec();
};

sondageSchema.methods.updatePropositionValideEtEmbed = async function (idSondage: string, propositionValide: Proposition, embed: EmbedBuilder): Promise<Sondage>
{
    return this.findOneAndUpdate({id_sondage: idSondage},
        {proposition_valide: propositionValide, design_sondage: embed}).exec();
};

sondageSchema.methods.updateEmbed = async function (idSondage: string, embed: EmbedBuilder): Promise<Sondage>
{
    return this.findOneAndUpdate({id_sondage: idSondage},
        {design_sondage: embed}).exec();
};

// EXPORTATION
export const SondageBDD = mongo.model<Sondage, SondageModel>('Sondage', sondageSchema);