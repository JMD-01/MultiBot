import {Router} from "express";
import {Bots} from "../../Queue/QueueController";
import {MCBot} from "../../Minecraft/MCBot";

const MOVE_DIRECTION = Router();

MOVE_DIRECTION.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let direction = req.body.direction;
    switch(direction){
        case "left":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.MoveLeft();
                }
            }
            break;
        case "right":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.MoveRight();
                }
            }
            break;
        case "forward":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.MoveForward();
                }
            }
            break;
        case "back":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.MoveBack();
                }
            }
            break;
    }
    res.status(204).send();
});

export default MOVE_DIRECTION;