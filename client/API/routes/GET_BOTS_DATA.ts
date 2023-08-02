import {Router} from "express";
import {AuthList, Bots} from "../../Queue/QueueController";

const GET_BOTS_DATA = Router();

interface BOTS_DATA {
    ID: string
    email: string
    online : boolean
    username: string
    ping: number

}
GET_BOTS_DATA.get("/", (req, res) => {
    let data: BOTS_DATA[] = []
    for(let bot of Bots){
        data.push({
            ID: bot.ID,
            email: bot.Email,
            online: bot.online,
            username: bot.GetBotInfo()?.name || "",
            ping: bot.GetBotInfo()?.ping || 0
        })
    }
    res.json(data);
});

export default GET_BOTS_DATA;