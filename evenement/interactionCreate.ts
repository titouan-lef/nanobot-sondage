import { ChatInputCommandInteraction, GuildBasedChannel, GuildMember, Interaction, PermissionsBitField } from "discord.js";
import commande from "../commande";
import fichierCommande from "../interaction/commande"
import interactionBouton from "../interaction/bouton"

export default async (interaction: Interaction): Promise<void> =>
{
    let channel: GuildBasedChannel = <GuildBasedChannel> interaction.channel;
    let me: GuildMember = <GuildMember> interaction.guild?.members.me;
    if (channel.permissionsFor(me).has(PermissionsBitField.Flags.ViewChannel)
        && channel.permissionsFor(me).has(PermissionsBitField.Flags.SendMessages)
        && channel.permissionsFor(me).has(PermissionsBitField.Flags.MentionEveryone))
    {
        if (interaction.isCommand() && interaction.commandName in commande)
            fichierCommande[interaction.commandName as keyof typeof fichierCommande](<ChatInputCommandInteraction> interaction);
    }
    else
        console.log("Le bot n'a pas accès au channel");

    if (interaction.isButton())
        interactionBouton(interaction);
};