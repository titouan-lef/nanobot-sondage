const mongo = require("mongoose");
const req = require("./req.js");

const sondage = mongo.Schema({
    id_sondage: req.getString(),
    question: req.getString(),
    choix_multiple: req.getBoolean(),
    montrer: req.getBoolean(),
    ajout: req.getBoolean(),
    rappel: req.getBoolean(),
    proposition_valide: req.getObject(),
    tag: req.getString(),
    texte: req.getString(),
    design_sondage: req.getObject(),
    minuteur: req.getNumber()
});

module.exports = mongo.model('sondage', sondage);