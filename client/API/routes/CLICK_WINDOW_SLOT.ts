import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const CLICK_WINDOW_SLOT = Router();

CLICK_WINDOW_SLOT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let slot = req.body.slot;
    let button = req.body.button;
    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.ClickWindowSlot(slot, button);
        }
    }
    res.status(204).send();
});

export default CLICK_WINDOW_SLOT;