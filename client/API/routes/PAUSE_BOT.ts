import {Router} from "express";
import * as QueueController from "../../Queue/QueueController";

const PAUSE_BOT = Router();

PAUSE_BOT.post("/", (req, res) => {
    let pause = QueueController.Pause();
    if (pause === true) {
        res.send({
            status: true,
            message: "Bot Paused!"
        })
    } else if (pause === false) {
        res.send({
            status: false,
            message: "Bot Unpaused!"
        })
    } else if (pause === null) {
        res.send({
            status: false,
            message: "Bot not paused, error occurred!"
        })
    }
});

export default PAUSE_BOT;