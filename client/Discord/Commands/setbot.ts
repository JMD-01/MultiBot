import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Config} from "../../Models/Config";
import {SaveDB} from "../../../Data/DatabaseReader/DB";

export = {
    data: new SlashCommandBuilder()
        .setName('setbot')
        .setDescription('Set amount of bots you want to join server!')
        .addIntegerOption(option => option.setName('bot-amount').setRequired(true).setDescription('Amount of bots you want to join server!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        Config.BotCount = interaction.options.getInteger('bot-amount',true); //Update Config using the retrieved data
        SaveDB(); //Update and save the DB
        let message: string = `✅ Bot amount set to ${Config.BotCount}!`;
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SetBot", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}
