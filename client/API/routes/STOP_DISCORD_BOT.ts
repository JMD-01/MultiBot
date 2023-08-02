import {Router} from "express";
import * as QueueController from "../../Queue/QueueController";
import {Log} from "../../Utils/Logger";
import {StartBot, StopBot} from "../../Discord/DiscordBot";

const STOP_DISCORD_BOT = Router();

STOP_DISCORD_BOT.post("/", (req, res) => {
    StopBot();
    res.status(204).send();
});

export default STOP_DISCORD_BOT;