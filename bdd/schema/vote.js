const mongo = require("mongoose");
const req = require("./req.js");

const vote = mongo.Schema({
    id_vote: req.getString(),
    proposition: req.getString(),
    nb_vote: req.getNumber(),
    cle_utilisateur: req.getString()// Clé étrangère
});

module.exports = mongo.model('vote', vote);