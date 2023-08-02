import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const GET_BOT_MESSAGES = Router();

GET_BOT_MESSAGES.get("/:botID", async (req, res) => {
    const botID = req.params.botID
    let messages: string[] = [];
    for(let bot of Bots){
        if(bot.ID == botID){
            messages = bot.Messages;
            break;
        }
    }
    res.json(messages);
});

export default GET_BOT_MESSAGES;