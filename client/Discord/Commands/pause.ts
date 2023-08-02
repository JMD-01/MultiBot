import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import * as QueueController from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the bot!'),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let message: string = "";
        let pause = QueueController.Pause();
        if (pause === true) {
            message += "✅ Bot paused!";
        } else if (pause === false) {
            message += "✅ Bot unpaused!";
        } else if (pause === null) {
            message += "⚠️ Bot not running!";
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Pause", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}