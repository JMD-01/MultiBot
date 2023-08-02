import {Router} from "express";
import {Config} from "../../Models/Config";
import {ProxyType} from "../../Proxy/ProxyType";

const GET_CONFIG = Router();

GET_CONFIG.get("/", (req, res) => {
    let data = {
        ServerIP: Config.ServerIP,
        Port: Config.Port,
        Version: Config.Version,
        BotCount: Config.BotCount,
        JoinSpeed: Config.JoinSpeed,
        JoinCommand: Config.JoinCommand,
        AccountPath: Config.AccountFilePath,
        Physics: Config.Physics,
        DiscordToken: Config.DiscordToken,
        ChannelID: Config.ChannelID,
        Proxy: Config.Proxy,
        ProxyType: ProxyType[Config.ProxyType],
        AltsPerProxy: Config.AltsPerProxy,
        ProxyFilePath: Config.ProxyFilePath
    }
    res.json(data);
});

export default GET_CONFIG;