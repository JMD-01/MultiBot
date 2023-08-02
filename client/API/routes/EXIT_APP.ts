import {Router} from "express";

const EXIT_APP = Router();

EXIT_APP.post("/", (req, res) => {
    res.status(204).send();
    process.exit(0);
});

export default EXIT_APP;