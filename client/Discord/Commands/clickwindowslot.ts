import {SlashCommandBuilder, ToAPIApplicationCommandOptions} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";
import {Bots} from "../../Queue/QueueController";

export = {
    data: new SlashCommandBuilder()
        .setName('clickwindowslot')
        .setDescription('Clicks a window slot!')
        .addStringOption(option =>
            option
                .setName('username')
                .setDescription('Username for user to click slot')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('slot')
                .setDescription('Slot to click')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('mode')
                .setDescription('Mode to click, 0 = left, 1 = right')
                .addChoice('left', 0)
                .addChoice('right', 1)
                .setRequired(true)
        )
    ,
    execute: async (interaction: Interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;
        let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
        let slot: number = <number>interaction.options.getInteger('slot'); //Get slot
        let mode: number = <number>interaction.options.getInteger('mode'); //Get mode
        let username: string = <string>interaction.options.getString('username'); //Get username
        let isValidBot: boolean = Bots.some(bot => bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase()); //Check if bot is valid
        let message: string = "";
        //Check if bot is valid
        if(isValidBot || username === "*") {
            //Loop thru all bots
            for(let bot of Bots){
                //Check if bot equals username
                if(bot.GetBotInfo()?.name.toUpperCase() === username.toUpperCase() || username === "*"){
                    bot.ClickWindowSlot(slot, mode); //Click slot
                }
            }
            message += `✅ Clicked slot ${slot} with mode ${mode} for ${username}!`; //Set message
            //Bot not found
        } else {
            message += `⚠️ The bot username ${username} was not found!`;
        }
        const embed = new MessageEmbed()
            .setAuthor(user.username +" | Click Slot", <string>user.avatarURL())
            .setTimestamp()
            .setDescription(message)
            .setColor(0x00AE86)
            .setFooter("<required> [optional]")
        await interaction.reply({
            embeds: [embed]
        });
    },
}
