import {Router} from "express";
import {BotStatus, Paused} from "../../Queue/QueueController";
import {DiscordBotStatus} from "../../Discord/DiscordBot";

const GET_BOT_STATUS = Router();

GET_BOT_STATUS.get("/", (req, res) => {
    let data = {
        bot_status: "OFFLINE",
        discord_status: "OFFLINE",
    }

    switch (true) {
        case BotStatus && !Paused:
            data.bot_status = "ONLINE";
            break;
        case BotStatus && Paused:
            data.bot_status = "PAUSED";
            break;
        case !BotStatus && !Paused:
            data.bot_status = "OFFLINE";
            break;
        default:
            data.bot_status = "OFFLINE";
            break;
    }

    switch (true){
        case DiscordBotStatus:
            data.discord_status = "ONLINE";
            break;
        case !DiscordBotStatus:
            data.discord_status = "OFFLINE";
            break;
        default:
            data.discord_status = "OFFLINE";
            break;
    }
    res.json(data);
});

export default GET_BOT_STATUS;