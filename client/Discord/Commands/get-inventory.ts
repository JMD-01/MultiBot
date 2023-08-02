import {SlashCommandBuilder, ToAPIApplicationCommandOptions} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User, Util} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('get-inventory')
        .setDescription('Shows the current inventory!')
        .addStringOption(option => option
            .setName('username')
            .setDescription('The user to get the inventory of.')
            .setRequired(true)
        ),
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member || !interaction.channel) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let username: string = <string>interaction.options.getString('username'); //Get username
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        let messages: string[] = [];
        //Check if bot is valid
        if(isValidBot){
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()){
                    let inventory = bot.GetInventory() || [];
                    for(let item of inventory) {
                        let thisItem = JSON.stringify(item);
                        if(messages.length === 0 || messages[messages.length - 1].length + thisItem.length > 1800) {
                            messages.push(thisItem);
                        } else {
                            messages[messages.length - 1] += thisItem;
                        }
                    }
                    message += `✅ Get inventory information for ${username}`; //Set message
                }
            }
            //Bot not found
        } else {
            message += `⚠️ The bot username ${username} was not found!`;
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Get Inventory", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86)
            .setFooter("<required> [optional]");
        await interaction.reply({
            embeds: [embed]
        });
        for (let message of messages) {
            await interaction.channel.send(Formatters.codeBlock('json', message));
        }
    },
}
