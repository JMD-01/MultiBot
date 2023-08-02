import {Router} from "express";
import {SystemInfo, SystemUsage, UsageInfo} from "../../Utils/SystemInfo";

const GET_SPECS_DATA = Router();

GET_SPECS_DATA.get("/", async (req, res) => {
    let specs_data = await SystemInfo();
    res.send(specs_data);
});

export default GET_SPECS_DATA;