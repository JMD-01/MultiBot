import {Client, Collection, Intents, MessageEmbed} from "discord.js";
import {Config} from "../Models/Config";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

export let DiscordBotStatus = false; // True for online, false for offline
export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
client.commands.set("help",require("./Commands/help")); //Help Command
client.commands.set("setbot",require("./Commands/setbot")); //SetBot Command
client.commands.set("setjoincmd", require("./Commands/setjoincmd")); //Join command
client.commands.set("online", require("./Commands/online")); //Online command
client.commands.set("pause", require("./Commands/pause")); //Pause command
client.commands.set("start", require("./Commands/start")); //Start command
client.commands.set("stop", require("./Commands/stop")); //Stop command
client.commands.set("settings", require("./Commands/settings")); //Settings command
client.commands.set("setjoinspeed", require("./Commands/setjoinspeed")); //JoinSpeed command
client.commands.set("sendchat", require("./Commands/sendchat")); //SendChat command
client.commands.set("sendallchat", require("./Commands/sendallchat")); //SendAllChat command
client.commands.set("setip", require("./Commands/setip")); //SetIP command
client.commands.set("viewchat", require("./Commands/viewchat")); //ViewChat command
client.commands.set("clickwindowslot", require("./Commands/clickwindowslot")); //ClickWindowSlot command
client.commands.set('drop-inventory', require('./Commands/drop-inventory')); //Drop Inventory command
client.commands.set('close-inventories', require('./Commands/close-inventories')); //Close Inventories command
client.commands.set('get-slot', require('./Commands/get-slot')); //Get Slot command
client.commands.set('get-inventory', require('./Commands/get-inventory')); //Get Inventory command

client.on("error",err=>{
    console.log(err);
})

function LoadCommands() {
    const rest = new REST({ version: '9' }).setToken(Config.DiscordToken);

    (async () => {
        try {
            let commands = [];
            for(let [key,command] of client.commands){
                commands.push(command.data.toJSON());
            }

            if (client.user?.id) {
                for(let guildID of client.guilds.cache.map(guild => guild.id)){
                    await rest.put(
                        Routes.applicationGuildCommands(client.user?.id, guildID),
                        {body: commands},
                    );
                }
            }

        } catch (error) {
            console.log(error);
        }
    })();
}

client.on("ready",()=>{
    console.log("Discord Bot Logged in!");
    LoadCommands();
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if(interaction.channelId !== Config.ChannelID) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
            const embed = new MessageEmbed()
                .setAuthor("Error")
                .setTimestamp()
                .setDescription("⚠️ There was an error while executing this command!: "+error.message)
                .setColor(0x00AE86);
            await interaction.channel?.send({
                embeds: [embed]
            });
    }
});

export function StartBot():void{
    try {
        client.login(Config.DiscordToken).then();
        DiscordBotStatus = true;
    } catch (error) {
        DiscordBotStatus = false;
        console.log(error);
    }
}

export function StopBot():void{
    try {
        client.destroy();
        DiscordBotStatus = false;
    } catch (error) {
        DiscordBotStatus = false;
        console.log(error);
    }
}
