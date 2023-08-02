import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Config} from "../../Models/Config";
import {SaveDB} from "../../../Data/DatabaseReader/DB";

export = {
    data: new SlashCommandBuilder()
        .setName('setip')
        .setDescription('Server IP to join!')
        .addStringOption(option => option.setName('server-ip').setRequired(true).setDescription('IP of server to join!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        Config.ServerIP = interaction.options.getString('server-ip',true); //Update Config using the retrieved data
        SaveDB(); //Update and save the DB
        let message: string = `✅ ServerIP set to ${Config.ServerIP}!`;
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SetIP", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}