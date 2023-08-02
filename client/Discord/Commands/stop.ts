import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import * as QueueController from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the bot!'),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let message: string = "";
        let stop = QueueController.Stop();
        if (stop === true) {
            message += "✅ Bot stopped!";
        } else if (stop === false) {
            message += "⚠️ Bot already stopped!";
        } else if (stop === null) {
            message += "⚠️ Error occurred while trying to stop bot!";
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Stop", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}