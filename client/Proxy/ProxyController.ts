import {BotOptions} from "mineflayer";
import {SocksClient, SocksClientOptions} from "socks";
import * as ProxyAgent from "proxy-agent";
import {Config} from "../Models/Config";
import {ProxyType} from "./ProxyType";
import {request, RequestOptions} from "http";
import {ReadProxyList} from "./ProxyListReader";
import {CheckProxy} from "./ProxyChecker";

export interface Proxy{
    host: string;
    port: number;
    type: number;
    userId?: string;
    password?: string;
}
export interface ProxyCounter{
    altsUsingProxy: number;
    proxy: Proxy;
    BotIDs: string[];
    checked: boolean;
    lastChecked: number
}

let Proxies: Array<ProxyCounter> = new Array<ProxyCounter>();

export function RemoveCounterProxy(BotID: string):void{
    let indexProxies = Proxies.findIndex(proxy => proxy.BotIDs.includes(BotID));
    if(indexProxies !== -1){
        Proxies[indexProxies].BotIDs = Proxies[indexProxies].BotIDs.filter(botID => botID !== BotID);
        if(Proxies[indexProxies].altsUsingProxy > 0){
            Proxies[indexProxies].altsUsingProxy--;
        }
    }
}

export function LoadProxies():void{
    Proxies = new Array<ProxyCounter>();
    for (let proxy of ReadProxyList(Config.ProxyFilePath)) {
        Proxies.push({altsUsingProxy: 0, proxy: proxy, BotIDs: new Array<string>(), checked: false, lastChecked: 0});
    }
}

/**
* Get Proxy for BotOptions
* @param {String} BotID Input BotID that will use proxy
* @return {Proxy} Checked Proxy for Use
**/
async function GetProxy(BotID: string): Promise<Proxy> {
    //Retrieve index of element with lowest value
    let LowestIndexProxy: number = Proxies.reduce((lowestAmountIndex, amountObj, index) => {
        return Proxies[lowestAmountIndex].altsUsingProxy < amountObj.altsUsingProxy ? lowestAmountIndex : index
    }, 0);
    //Check if Proxy exists or can add more Alts to Proxy if not No more proxies are available
    if(Proxies[LowestIndexProxy] === undefined || Proxies[LowestIndexProxy].altsUsingProxy >= Config.AltsPerProxy){
        throw new Error("No proxies available!");
    } else {
        //Check if proxy is working
        if(await CheckProxy(Proxies[LowestIndexProxy]) === null){
            Proxies.splice(LowestIndexProxy,1); //Remove invalid proxy
            return await GetProxy(BotID); //Return this function to retry another proxy
        }
        Proxies[LowestIndexProxy].BotIDs.push(BotID); //Add BotID to using IDs
        Proxies[LowestIndexProxy].altsUsingProxy++; //Add number to altsUsingProxy
        return Proxies[LowestIndexProxy].proxy; //Return this proxy
    }
}

export async function Proxify(inputOptions: BotOptions, BotID: string): Promise<BotOptions>{
    let currentProxy: Proxy = await GetProxy(BotID);
    switch (Config.ProxyType) {
        case ProxyType.HTTP:
            let HTTPOptions: RequestOptions = {
                host: currentProxy.host,
                port: currentProxy.port,
                method: 'CONNECT',
                path: `${Config.ServerIP}:${Config.Port}`,
            };
            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                HTTPOptions.headers = {
                    'Proxy-Authorization': 'Basic ' + Buffer.from(currentProxy.userId + ':' + currentProxy.password).toString('base64'),
                }
            }
            let HTTPProxyAgent: any = {
                protocol: 'http',
                host: currentProxy.host,
                port: currentProxy.port.toString()
            }
            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                HTTPProxyAgent.userId = currentProxy.userId;
                HTTPProxyAgent.password = currentProxy.password;
            }
            return {
                connect: client => {
                    const req = request(HTTPOptions);
                    req.end();

                    req.on('connect', (res, stream) => {
                        // @ts-ignore
                        client.setSocket(stream)
                        client.emit('connect')
                    });
                },
                // @ts-ignore
                agent: new ProxyAgent(HTTPProxyAgent),
                ...inputOptions
            };
        case ProxyType.SOCKS4:
            let SOCKS4Options: SocksClientOptions = {
                proxy: {
                    host: currentProxy.host,
                    port: currentProxy.port,
                    type: 4
                },
                command: 'connect',
                destination: {
                    host: Config.ServerIP,
                    port: Config.Port
                }
            };
            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                SOCKS4Options.proxy.userId = currentProxy.userId;
                SOCKS4Options.proxy.password = currentProxy.password;
            }
            let SOCKS4ProxyAgent: any = {
                protocol: 'socks4:',
                host: currentProxy.host,
                port: currentProxy.port.toString()
            }

            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                SOCKS4ProxyAgent.userId = currentProxy.userId;
                SOCKS4ProxyAgent.password = currentProxy.password;
            }
            return {
                connect: client => {
                    SocksClient.createConnection(SOCKS4Options, (err: any, info: { socket: any; }) => {
                        if (err) {
                            console.log(err)
                            return;
                        }

                        // @ts-ignore
                        client.setSocket(info.socket)
                        client.emit('connect')
                    });
                },
                // @ts-ignore
                agent: new ProxyAgent(SOCKS4ProxyAgent),
                ...inputOptions
            };

        case ProxyType.SOCKS5:
            let SOCKS5Options: SocksClientOptions = {
                proxy: {
                    host: currentProxy.host,
                    port: currentProxy.port,
                    type: 5
                },
                command: 'connect',
                destination: {
                    host: Config.ServerIP,
                    port: Config.Port
                }
            };
            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                SOCKS5Options.proxy.userId = currentProxy.userId;
                SOCKS5Options.proxy.password = currentProxy.password;
            }
            let SOCKS5ProxyAgent: any = {
                    protocol: 'socks5:',
                    host: currentProxy.host,
                    port: currentProxy.port.toString()
                }

            if(currentProxy.userId !== undefined && currentProxy.password !== undefined){
                SOCKS5ProxyAgent.userId = currentProxy.userId;
                SOCKS5ProxyAgent.password = currentProxy.password;
            }
            return {
                connect: client => {
                    SocksClient.createConnection(SOCKS5Options, (err: any, info: { socket: any; }) => {
                        if (err) {
                            console.log(err)
                            return;
                        }

                        // @ts-ignore
                        client.setSocket(info.socket)
                        client.emit('connect')
                    });
                },
                // @ts-ignore
                agent: new ProxyAgent(SOCKS5ProxyAgent),
                ...inputOptions
            };
    }
}