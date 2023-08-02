import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const PLACE_BLOCK = Router();

PLACE_BLOCK.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let x = req.body.x;
    let y = req.body.y;
    let z = req.body.z;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.PlaceBlock(x, y ,z)
        }
    }
    res.status(204).send();
});

export default PLACE_BLOCK;