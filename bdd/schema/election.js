const mongo = require("mongoose");
const req = require("./req.js");

const election = mongo.Schema({
    id_vote: req.getString(),
    proposition: req.getString(),
    nb_vote: req.getNumber(),
    votant: req.getStringVide(),
    id_sondage: req.getString()// Clé étrangère
});

module.exports = mongo.model('election', election);