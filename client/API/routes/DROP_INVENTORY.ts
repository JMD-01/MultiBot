import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const DROP_INVENTORY = Router();

DROP_INVENTORY.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let delay = req.body.delay;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.DropInventory(delay);
        }
    }
    res.status(204).send();
});

export default DROP_INVENTORY;