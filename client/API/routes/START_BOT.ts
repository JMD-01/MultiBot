import {Router} from "express";
import * as QueueController from "../../Queue/QueueController";
import {Log} from "../../Utils/Logger";

const START_BOT = Router();

START_BOT.post("/", (req, res) => {
    let start = QueueController.Start();
    if (start === true) {
        res.send({
            status: true,
            message: "Bot Started!"
        });
    } else if (start === false) {
        res.send({
            status: false,
            message: "Bot already started!"
        });
    } else if (start === null) {
        res.send({
            status: null,
            message: "Bot not started error occurred!"
        });
    }
});

export default START_BOT;