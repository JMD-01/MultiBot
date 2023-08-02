import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const DROP_SLOT = Router();

DROP_SLOT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let slotID = req.body.slotID;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.DropSlot(slotID);
        }
    }
    res.status(204).send();
});

export default DROP_SLOT;