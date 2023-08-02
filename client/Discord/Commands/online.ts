import {SlashCommandBuilder} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('View online bots name and pings'),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let counter: number = 0;
        let message: string = "";
        //Look thru all bots to get information
        for (let bot of Bots) {
            let botInfo = bot.GetBotInfo(); //Get bot information
            if(botInfo !== undefined){
                counter++;
                message += `${Formatters.bold(botInfo.name)}(${botInfo.ping}ms)\n`; //Message constructor
            }
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Online", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(`${Formatters.bold("ONLINE: "+counter)}\n ${message}`)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}