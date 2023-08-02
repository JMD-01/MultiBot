import React, { createContext } from 'react';
import { ChangeLog } from '../tabs/Changelog';
import { InitialSystemInfo } from '../tabs/Specification';

interface DataStorageContext {
    changelogs: ChangeLog[];
    setChangelogs: (changelog: ChangeLog[]) => void;
    port: string | undefined;
    url: string;
    systemSpecs: InitialSystemInfo | undefined;
    accountFilePath: string;
    setAccountFilePath: (path: string) => void;
    serverIP: string;
    setServerIP: (ip: string) => void;
    serverPort: number;
    setServerPort: (port: number) => void;
    version: string;
    setVersion: (version: string) => void;
    botStatus: string;
    setBotStatus: (status: string) => void;
    discordStatus: string;
    setDiscordStatus: (status: string) => void;
    joinCommand: string;
    setJoinCommand: (command: string) => void;
    joinSpeed: number;
    setJoinSpeed: (speed: number) => void;
    botAmount: number;
    setBotAmount: (amount: number) => void;
    physics: boolean;
    setPhysics: (physics: boolean) => void;
    proxy: boolean;
    setProxy: (proxy: boolean) => void;
    proxyType: string;
    setProxyType: (type: string) => void;
    altsPerProxy: number;
    setAltsPerProxy: (alts: number) => void;
    proxyPath: string;
    setProxyPath: (path: string) => void;
    discordToken: string;
    setDiscordToken: (token: string) => void;
    channelID: string;
    setChannelID: (id: string) => void;
}
export const DataStorage = createContext<DataStorageContext>(
    {
        changelogs: [],
        setChangelogs: () => { },
        port: undefined,
        url: '',
        systemSpecs: undefined,
        accountFilePath: '',
        setAccountFilePath: () => { },
        serverIP: '',
        setServerIP: () => { },
        serverPort: 25565,
        setServerPort: () => { },
        version: '1.8',
        setVersion: () => { },
        botStatus: 'OFFLINE',
        setBotStatus: () => { },
        discordStatus: 'OFFLINE',
        setDiscordStatus: () => { },
        joinCommand: '',
        setJoinCommand: () => { },
        joinSpeed: 5000,
        setJoinSpeed: () => { },
        botAmount: 10,
        setBotAmount: () => { },
        physics: false,
        setPhysics: () => { },
        proxy: false,
        setProxy: () => { },
        proxyType: 'SOCKS5',
        setProxyType: () => { },
        altsPerProxy: 5,
        setAltsPerProxy: () => { },
        proxyPath: '',
        setProxyPath: () => { },
        discordToken: '',
        setDiscordToken: () => { },
        channelID: '',
        setChannelID: () => { }
    });
