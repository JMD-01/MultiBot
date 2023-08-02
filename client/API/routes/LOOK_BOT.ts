import {Router} from "express";
import {Bots} from "../../Queue/QueueController";
import {MCBot} from "../../Minecraft/MCBot";

const LOOK_BOT = Router();

LOOK_BOT.post("/", async (req, res) => {
    let botIDs = req.body.botIDs;
    let direction = req.body.direction;
    switch(direction){
        case "up":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookUp();
                }
            }
            break;
        case "down":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookDown();
                }
            }
            break;
        case "south":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookSouth();
                }
            }
            break;
        case "north":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookNorth();
                }
            }
            break;
        case "west":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookWest();
                }
            }
            break;
        case "east":
            for(let bot of Bots){
                if(botIDs.includes(bot.ID)){
                    bot.LookEast();
                }
            }
            break;
    }
    res.status(204).send();
});

export default LOOK_BOT;