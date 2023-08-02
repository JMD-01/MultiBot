import {Router} from "express";
import * as QueueController from "../../Queue/QueueController";
import {Log} from "../../Utils/Logger";

const STOP_BOT = Router();

STOP_BOT.post("/", (req, res) => {
    let stop = QueueController.Stop();
    if (stop === true) {
        res.send({
            status: true,
            message: "Bot stopped"
        });
    } else if (stop === false) {
        res.send({
            status: false,
            message: "Bot already stopped"
        });
    } else if (stop === null) {
        res.send({
            status: null,
            message: "Bot not stopped, error occurred"
        });
    }
});

export default STOP_BOT;