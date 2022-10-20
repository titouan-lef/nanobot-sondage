module.exports = (bot) => {
    for (const [, command] of Object.entries(bot.commande))
        bot.application.commands.create(command());

    console.log("bot ok");
};