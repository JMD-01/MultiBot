import {Collection, Interaction} from "Discord/discord";
import {SlashCommandBuilder} from "@discordjs/builders";

declare module "Discord/discord" {
    export interface Client {
        commands: Collection<unknown, Command>
    }

    export interface Command {
        data: SlashCommandBuilder;
        execute: (interaction: Interaction) => Promise<void>;
    }
}