import {Router} from "express";
import {Bots} from "../../Queue/QueueController";

const SET_HOTBAR = Router();

SET_HOTBAR.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let hotbar = req.body.hotbar;

    for(let bot of Bots){
        if(botIDs.includes(bot.ID)){
            bot.SetHotBarSlot(hotbar);
        }
    }
    res.status(204).send();
});

export default SET_HOTBAR;