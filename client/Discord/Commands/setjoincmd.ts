import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Config} from "../../Models/Config";
import {SaveDB} from "../../../Data/DatabaseReader/DB";

export = {
    data: new SlashCommandBuilder()
        .setName('setjoincmd')
        .setDescription('Set the command you want the bot to execute on joining the server!')
        .addStringOption(option => option.setName('join-command').setRequired(true).setDescription('Command to execute when joining server!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        Config.JoinCommand = interaction.options.getString('join-command',true); //Update Config using the retrieved data
        SaveDB(); //Update and save the DB
        let message: string = `✅ Join command set to "${Config.JoinCommand}"!`;
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SetJoinCMD", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}