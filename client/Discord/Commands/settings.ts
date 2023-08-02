import {SlashCommandBuilder} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Config} from "../../Models/Config";

export = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Config settings for the application!'),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let message: string = Formatters.bold("Settings: \n") +" ";
        message += Formatters.bold("ServerIP: ") + Config.ServerIP + "\n";
        message += Formatters.bold("Port: ") + Config.Port + "\n";
        message += Formatters.bold("Version: ") + Config.Version + "\n";
        message += Formatters.bold("BotCount: ") + Config.BotCount + "\n";
        message += Formatters.bold("JoinSpeed: ") + Config.JoinSpeed + "\n";
        message += Formatters.bold("JoinCommand: ") + Config.JoinCommand + "\n";
        message += Formatters.bold("AccountFilePath: ") + Config.AccountFilePath + "\n";
        message += Formatters.bold("Threads: ") + Config.Threads + "\n";
        message += Formatters.bold("Physics: ") + Config.Physics + "\n";
        message += Formatters.bold("ChannelID: ") + Config.ChannelID + "\n";
        message += Formatters.bold("Debug: ") + Config.Debug + "\n";
        message += Formatters.bold("Proxy: ") + Config.Proxy + "\n";
        message += Formatters.bold("ProxyType: ") + Config.ProxyType + "\n";
        message += Formatters.bold("AltsPerProxy: ") + Config.AltsPerProxy + "\n";
        message += Formatters.bold("ProxyFilePath: ") + Config.ProxyFilePath + "\n";
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Settings", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}