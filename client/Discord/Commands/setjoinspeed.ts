import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Config} from "../../Models/Config";
import {SaveDB} from "../../../Data/DatabaseReader/DB";

export = {
    data: new SlashCommandBuilder()
        .setName('setjoinspeed')
        .setDescription('Set the speed you want bots to join server in milliseconds!')
        .addIntegerOption(option => option.setName('join-speed-ms').setRequired(true).setDescription('Speed to join server in milliseconds!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        Config.JoinSpeed = interaction.options.getInteger('join-speed-ms',true); //Update Config using the retrieved data
        SaveDB(); //Update and save the DB
        let message: string = `✅ Join Speed set to ${Config.JoinSpeed}ms!`;
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SetJoinSpeed", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}