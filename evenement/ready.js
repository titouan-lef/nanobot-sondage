module.exports = (bot) => {
    bot.application.commands.create(bot.commande.sondage());
    console.log("bot ok");
};