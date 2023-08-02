import {Router} from "express";
import {Config} from "../../Models/Config";
import {ProxyType} from "../../Proxy/ProxyType";
import {SaveDB} from "../../../Data/DatabaseReader/DB";

const UPDATE_CONFIG = Router();

UPDATE_CONFIG.post("/", (req, res) => {
    let data = req.body;
    Config.ServerIP = data.ServerIP === undefined ? Config.ServerIP : data.ServerIP;
    Config.Port = data.Port === undefined ? Config.Port : data.Port;
    Config.Version = data.Version === undefined ? Config.Version : data.Version;
    Config.BotCount = data.BotCount === undefined ? Config.BotCount : data.BotCount;
    Config.JoinSpeed = data.JoinSpeed === undefined ? Config.JoinSpeed : data.JoinSpeed;
    Config.JoinCommand = data.JoinCommand === undefined ? Config.JoinCommand : data.JoinCommand;
    Config.AccountFilePath = data.AccountPath === undefined ? Config.AccountFilePath : data.AccountPath;
    Config.Physics = data.Physics === undefined ? Config.Physics : data.Physics;
    Config.DiscordToken = data.DiscordToken === undefined ? Config.DiscordToken : data.DiscordToken;
    Config.ChannelID = data.ChannelID === undefined ? Config.ChannelID : data.ChannelID;
    Config.Proxy = data.Proxy === undefined ? Config.Proxy : data.Proxy;
    Config.ProxyType = data.ProxyType === undefined ? Config.ProxyType : ProxyStringToEnum(data.ProxyType);
    Config.AltsPerProxy = data.AltsPerProxy === undefined ? Config.AltsPerProxy : data.AltsPerProxy;
    Config.ProxyFilePath = data.ProxyFilePath === undefined ? Config.ProxyFilePath : data.ProxyFilePath;
    SaveDB();
    res.status(204).send();
});

function ProxyStringToEnum(proxy: string): ProxyType {
    switch (proxy) {
        case "HTTP":
            return ProxyType.HTTP;
        case "SOCKS4":
            return ProxyType.SOCKS4;
        case "SOCKS5":
            return ProxyType.SOCKS5;
        default:
            return Config.ProxyType;
    }
}

export default UPDATE_CONFIG;