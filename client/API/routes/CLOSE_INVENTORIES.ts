import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const CLOSE_INVENTORIES = Router();

CLOSE_INVENTORIES.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.CloseInventories();
        }
    }
    res.status(204).send();
});

export default CLOSE_INVENTORIES;