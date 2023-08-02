import {SlashCommandBuilder, ToAPIApplicationCommandOptions} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('close-inventories')
        .setDescription('Close the current inventory!')
        .addStringOption(option => option
            .setName('username')
            .setDescription('The user to close the inventory for.')
            .setRequired(true)
        ),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let username: string = <string>interaction.options.getString('username'); //Get username
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        //Check if bot is valid
        if(isValidBot || username === "*"){
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase() || username === "*"){
                    bot.CloseInventories(); //Close inventories
                }
            }
            message += `✅ Closed inventories for ${username}!`; //Set message
            //Bot not found
        } else {
            message += `⚠️ The bot username ${username} was not found!`;
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Close Inventories", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86)
            .setFooter("<required> [optional]")
        await interaction.reply({
            embeds: [embed]
        });
    },
}
