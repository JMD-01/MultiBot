import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const DROP_ITEM = Router();

DROP_ITEM.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let itemID = req.body.itemID;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.DropItem(itemID);
        }
    }
    res.status(204).send();
});

export default DROP_ITEM;