const mongo = require("mongoose");
const req = require("./req.js");

const utilisateur = mongo.Schema({
    id_utilisateur: req.getString(),
    nom: req.getString(),
    id_sondage: req.getString()// Clé étrangère
});

module.exports = mongo.model('utilisateur', utilisateur);