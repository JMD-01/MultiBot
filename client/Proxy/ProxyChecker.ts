import {ProxyCounter} from "./ProxyController";
import {get, request} from "http";
import {Debug} from "../Utils/Logger";
import {ProxyType} from "./ProxyType";
import {Config} from "../Models/Config";
import * as ProxyAgent from "proxy-agent";

export async function CheckProxy(proxy: ProxyCounter):Promise<ProxyCounter|null>{
    return new Promise((resolve, reject) => {

        if(Config.ProxyType === ProxyType.HTTP){
            const proxy_options: any = {
                method: 'CONNECT',
                path: 'http://ifconfig.me',
                timeout: 1000,
                agent: false,
                host: proxy.proxy.host,
                port: proxy.proxy.port,
            };
            if(proxy.proxy.userId !== undefined && proxy.proxy.password !== undefined){
                proxy_options.headers = {
                    'Proxy-Authorization': 'Basic ' + Buffer.from(proxy.proxy.userId + ':' + proxy.proxy.password).toString('base64'),
                }
            }

            const req = request(proxy_options);
            req.on('connect', res => {
                req.destroy();
                if (res.statusCode === 200) {
                    return resolve({
                        altsUsingProxy: proxy.altsUsingProxy,
                        proxy: proxy.proxy,
                        BotIDs: proxy.BotIDs,
                        checked: true,
                        lastChecked: Math.floor(Date.now() /1000)
                    });
                } else {
                    return resolve(null);
                }
            });
            req.on('timeout', () => {
                req.destroy();
            });
            req.on('error', err => {
                Debug(err);
                return resolve(null);
            });
            req.end();
        }
        if(Config.ProxyType === ProxyType.SOCKS4 || Config.ProxyType === ProxyType.SOCKS5){
            let SOCKSProxyAgent: any = {
                protocol: 'socks5:',
                host: proxy.proxy.host,
                port: proxy.proxy.port.toString()
            }
            if(Config.ProxyType === ProxyType.SOCKS4){
                SOCKSProxyAgent.protocol = "socks4:";
            }
            if(Config.ProxyType === ProxyType.SOCKS5){
                SOCKSProxyAgent.protocol = "socks5:";
            }
            if(proxy.proxy.userId !== undefined && proxy.proxy.password !== undefined){
                SOCKSProxyAgent.userId = proxy.proxy.userId;
                SOCKSProxyAgent.password = proxy.proxy.password;
            }
            let proxy_options: any ={
                method: 'GET',
                host: 'ifconfig.me',
                path: '/',
                agent: new ProxyAgent(SOCKSProxyAgent)
            }
            const req = get(proxy_options);
            req.on('response',res => {
                if (res.statusCode === 200) {
                    return resolve({
                        altsUsingProxy: proxy.altsUsingProxy,
                        proxy: proxy.proxy,
                        BotIDs: proxy.BotIDs,
                        checked: true,
                        lastChecked: Math.floor(Date.now() /1000)
                    });
                } else {
                    return resolve(null);
                }
            });
            req.on('timeout', () => {
                req.destroy();
            });
            req.on('error', err => {
                Debug(err);
                return resolve(null);
            });
        }
    });
}