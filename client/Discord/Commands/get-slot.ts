import {SlashCommandBuilder, ToAPIApplicationCommandOptions} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('get-slot')
        .setDescription('Gets a lot information!')
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Username to get slot information for.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('slot')
                .setDescription('Slot to get information for.')
                .setRequired(true)
        )
    ,
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let username: string = <string>interaction.options.getString('username'); //Get username
        let slot: number = <number>interaction.options.getInteger('slot'); //Get slot
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        //Check if bot is valid
        if(isValidBot){
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()){
                    let output = await bot.GetSlot(slot);
                    message = Formatters.codeBlock('json', JSON.stringify(output, null, 2));
                }
            }
            //Bot not found
        } else {
            message += `⚠️ The bot username ${username} was not found!`;
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Get Slot", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86)
            .setFooter("<required> [optional]")
        await interaction.reply({
            embeds: [embed]
        });
    },
}
