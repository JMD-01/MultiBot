import {existsSync, readFileSync} from "fs";
import {FileNotFoundException} from "../Models/Exceptions/FileNotFoundException";
import {Proxy} from "./ProxyController";
import {Config} from "../Models/Config";
import {ProxyType} from "./ProxyType";

/**
 *
 * @param filePath - The filepath to the account text file : string
 * @return ProxyList - The Array of Proxy : Proxy[]
 */
export function ReadProxyList(filePath: string):Array<Proxy>{
    let ProxyList: Proxy[] = new Array<Proxy>();
    for (let proxyDetail of ReadFileLines(filePath)) {
        let detail = proxyDetail.trim().split(":");
        //Proxy Detail
        if(detail.length === 2){
            ProxyList.push({host: detail[0],port: parseInt(detail[1]), type: Config.ProxyType === ProxyType.SOCKS5 ? 5 : 4});
        //Proxy Detail with Authentication
        } else if(detail.length === 4){
            ProxyList.push({host: detail[0],port: parseInt(detail[1]), type: Config.ProxyType === ProxyType.SOCKS5 ? 5 : 4, userId: detail[2], password: detail[3]});
        }

    }
    return ProxyList;
}

/**
 *
 * @param filePath - The filepath to the proxy text file : string
 * @return LineArray - The array containing each line in a text file : string[]
 */
function ReadFileLines(filePath: string):Array<string>{
    if(!existsSync(filePath)){
        throw new FileNotFoundException(`${filePath} does not exist!`);
    }
    let data: string = readFileSync(filePath,'utf-8');
    return data.split(/\r?\n/);
}