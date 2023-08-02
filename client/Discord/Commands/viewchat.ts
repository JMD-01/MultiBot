import {SlashCommandBuilder} from "@discordjs/builders";
import {Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('viewchat')
        .setDescription('View chat of a specific bot!')
        .addStringOption(option => option.setName('username').setRequired(true).setDescription('Username of the bot you want to view chat of!')),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let username: string = interaction.options.getString('username',true); //Get username
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        //Check if bot is valid
        if(isValidBot){
            await interaction.reply("Retrieving chatlogs!");
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()){
                    let messages: Array<string> = bot.Messages; //Get all bot messages
                    let newMessages: Array<string> = new Array<string>(); //Create new array to merge at end
                    let totalCharacters: number = 0; //Counter of total characters
                    messages.reverse(); //Reverse the order of messages
                    //Loop thru messages
                    for (let currentMessage of messages) {
                        //Check if message exceeds total amount of characters
                        if(totalCharacters+currentMessage.length >= 3500){
                            break; //Stop loop if exceed total amount
                        }else {
                            totalCharacters += currentMessage.length; //Add characters to total amount
                            newMessages.push(currentMessage); //Push message to new embed message array
                        }
                    }
                    newMessages.reverse(); //Reverse the messages to show in correct order
                    message += "`" + newMessages.join("\n") + "`";
                    const embed = new MessageEmbed()
                        .setAuthor(user.username +" | ViewChat", <string>user.avatarURL())
                        .setTimestamp()
                        .setDescription(message)
                        .setColor(0x00AE86);
                    await interaction.channel?.send({
                        embeds: [embed]
                    });
                    break; //Stop loop if found
                }
            }
            //Bot not found
        } else {
            await interaction.reply(`⚠️ The bot username ${username} was not found!`);
        }
    },
}