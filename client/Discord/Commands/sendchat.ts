import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('sendchat')
        .setDescription('Send chat to specific bot!')
        .addStringOption(option => option.setName('username').setRequired(true).setDescription('Username of the bot you want to send chat!'))
        .addStringOption(option => option.setName('message').setRequired(true).setDescription('Message or command to send on the bot!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let username: string = interaction.options.getString('username',true); //Get username
        let chatMessage: string = interaction.options.getString('message',true); //Get chatMessage
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        //Check if bot is valid
        if(isValidBot){
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()){
                    bot.SendChat(chatMessage); //Send Bot Chat message
                    message += `✅ Sent the message on: ${bot.GetBotInfo()?.name}: "${chatMessage}"!`;
                }
            }
        //Bot not found
        } else {
            message += `⚠️ The bot username ${username} was not found!`;
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | SendChat", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86);
        await interaction.reply({
            embeds: [embed]
        });
    },
}