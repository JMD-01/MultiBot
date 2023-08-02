import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const MINE_BLOCK = Router();

MINE_BLOCK.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let x = req.body.x;
    let y = req.body.y;
    let z = req.body.z;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.MineBlock(x, y, z);
        }
    }
    res.status(204).send();
});

export default MINE_BLOCK;