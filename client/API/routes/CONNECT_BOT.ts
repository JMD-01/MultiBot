import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const CONNECT_BOT = Router();

CONNECT_BOT.post("/:botID", (req, res) => {
    const botID = req.params.botID;
    for(let bot of Bots){
        if(bot.ID === botID){
            if(!bot.online){
                bot.Connect();
            } else {
                res.status(400).send("Bot is already online!");
            }
            break;
        }
    }
    res.status(204).send();
});

export default CONNECT_BOT;