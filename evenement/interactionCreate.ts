import { GuildBasedChannel, GuildMember, Interaction, PermissionsBitField } from "discord.js";
import commande from "../commande";

export default async (interaction: Interaction): Promise<void> =>
{
    let channel: GuildBasedChannel = <GuildBasedChannel> interaction.channel;
    let me: GuildMember = <GuildMember> interaction.guild?.members.me;
    if (channel.permissionsFor(me).has(PermissionsBitField.Flags.ViewChannel)
        && channel.permissionsFor(me).has(PermissionsBitField.Flags.SendMessages)
        && channel.permissionsFor(me).has(PermissionsBitField.Flags.MentionEveryone))
    {
        if (interaction.isCommand() && interaction.commandName in commande)
            require("../interaction/" + interaction.commandName + ".js")(interaction);
    }
    else
        console.log("Le bot n'a pas accès au channel");

    if (interaction.isButton())
        require("../interaction/bouton.js")(interaction);
};