import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import * as QueueController from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the bot!'),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let message: string = "";
        let start = QueueController.Start();
        if (start === true) {
            message += "✅ Bot started!";
        } else if (start === false) {
            message += "⚠️ Bot already running!";
        } else if (start === null) {
            message += "⚠️ Error occurred while trying to start bot!";
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Start", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}