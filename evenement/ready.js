module.exports = (bot) => {
    for (const [key] of Object.entries(bot.commande))
        bot.application.commands.create(bot.commande[key]());

    console.log("bot ok");
};