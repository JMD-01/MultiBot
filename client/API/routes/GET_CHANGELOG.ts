import {Router} from "express";
import {Config} from "../../Models/Config";
import {ProxyType} from "../../Proxy/ProxyType";

const GET_CHANGELOG = Router();

export interface ChangeLog {
    name: string,
    version: string,
    date: number,
    author: string,
    changes: string[]
}

GET_CHANGELOG.get("/", (req, res) => {
    let data: ChangeLog[] = [
        {
            name: "MultiBot",
            version: "2.0.0 BETA",
            date: Date.UTC(2022,2, 25, 2, 0, 0),
            author: "ProZed",
            changes: [
                "New GUI",
                "Added support for proxy",
                "Added World support",
                "Added movement",
                "Added inventory support",
                "Added microsoft account support",
                "FULLY recoded!"
            ]
        }
    ]
    res.json(data);
});

export default GET_CHANGELOG;