import {Router} from "express";
import {SystemUsage, UsageInfo} from "../../Utils/SystemInfo";

const GET_SYSTEM_USAGE = Router();

GET_SYSTEM_USAGE.get("/", async (req, res) => {
    let usage_data: SystemUsage = await UsageInfo();
    res.send(usage_data);
});

export default GET_SYSTEM_USAGE;