import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('sendallchat')
        .setDescription('Execute command or send chat on all Bots online!')
        .addStringOption(option => option.setName('message').setRequired(true).setDescription('Message or command you wish all bots to execute!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let chatMessage: string = interaction.options.getString('message',true); //Get chat message
        //Loop thru all bots to execute sendChat
        for(let bot of Bots){
            bot.SendChat(chatMessage); //Send message
        }
        let message: string = `✅ Sent this message on all Bots: ${chatMessage}!`;
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SendAllChat", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}