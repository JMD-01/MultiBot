import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const MOVE_BOT = Router();

MOVE_BOT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let x = req.body.x;
    let y = req.body.y;
    let z = req.body.z;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.Move(x, y, z);
        }
    }
    res.status(204).send();
});

export default MOVE_BOT;