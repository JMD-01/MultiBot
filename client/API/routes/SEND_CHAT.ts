import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const SEND_CHAT = Router();

SEND_CHAT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let message = req.body.message;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.SendChat(message);
        }
    }
    res.status(204).send();
});

export default SEND_CHAT;