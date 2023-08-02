import {Router} from "express";
import * as QueueController from "../../Queue/QueueController";
import {Log} from "../../Utils/Logger";
import {StartBot} from "../../Discord/DiscordBot";

const START_DISCORD_BOT = Router();

START_DISCORD_BOT.post("/", (req, res) => {
    StartBot();
    res.status(204).send();
});

export default START_DISCORD_BOT;