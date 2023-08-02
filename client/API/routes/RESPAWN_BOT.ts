import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const RESPAWN_BOT = Router();

RESPAWN_BOT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.Respawn();
        }
    }
    res.status(204).send();
});

export default RESPAWN_BOT;