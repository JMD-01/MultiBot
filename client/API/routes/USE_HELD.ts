import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const USE_HELD = Router();

USE_HELD.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.UseHeld();
        }
    }
    res.status(204).send();
});

export default USE_HELD;