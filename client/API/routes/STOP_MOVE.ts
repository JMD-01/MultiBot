import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const STOP_MOVE = Router();

STOP_MOVE.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.StopMove();
        }
    }
    res.status(204).send();
});

export default STOP_MOVE;