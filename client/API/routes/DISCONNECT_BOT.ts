import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const DISCONNECT_BOT = Router();

DISCONNECT_BOT.post("/:botID", (req, res) => {
    const botID = req.params.botID;
    for(let bot of Bots){
        if(bot.ID === botID){
            if(bot.online){
                bot.Disconnect();
            } else {
                res.status(400).send("Bot is not online");
            }
            break;
        }
    }
    res.status(204).send();
});

export default DISCONNECT_BOT;