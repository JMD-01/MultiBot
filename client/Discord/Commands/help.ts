import {SlashCommandBuilder, ToAPIApplicationCommandOptions} from "@discordjs/builders";
import {Formatters, Interaction, MessageEmbed, User} from "Discord/discord";
import {client} from "../DiscordBot";

export = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with all commands and usages!'),
    execute: async (interaction: Interaction) => {
            if(!interaction.isCommand() || !interaction.member) return;
            let user: User = await client.users.fetch(interaction.member.user.id); //Get user object
            let message: string = "";
            //Loop thru all commands to construct help message
            for(let [key,command] of client.commands.entries()){
                message += `${Formatters.bold("/"+command.data.name)} ${getCommandOptions(command.data.options)}: ${command.data.description}` + "\n"; //message builder
            }
            const embed = new MessageEmbed()
                .setAuthor(user.username +" | Help", <string>user.avatarURL())
                .setTimestamp()
                .setDescription(message)
                .setColor(0x00AE86)
                .setFooter("<required> [optional]")
            await interaction.reply({
                embeds: [embed]
            });
    },
}

//Create string with required and optional arguments for a command and return as a string
function getCommandOptions(options : ToAPIApplicationCommandOptions[]):string{
    let required: string = "";
    let optional: string = "";

    for(let option of options){
        //Required argument
        if(option.toJSON().required){
            required += Formatters.bold(`<${option.toJSON().name}>`)+" ";
        //Optional argument
        }else {
            optional += Formatters.italic(`[${option.toJSON().name}] `)+" ";
        }
    }

    return required+optional;
}
