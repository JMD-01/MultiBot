import {Version} from "./Version";
import {createHash} from "crypto";
import {ProxyType} from "../Proxy/ProxyType";
import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Config {
    @PrimaryColumn({type: "number"})
    public ID: number;
    @Column({type: "varchar", length: 255})
    public ServerIP: string = "";
    @Column({type: "number"})
    public Port: number = 25565;
    @Column({type: "varchar", length: 255})
    public Version: Version = "1.8"

    @Column({type: "number"})
    public BotCount: number = 5;
    @Column({type: "number"})
    public JoinSpeed: number = 5000;
    @Column({type: "varchar", length: 255})
    public JoinCommand: string = "";

    @Column({type: "varchar", length: 2048})
    public AccountFilePath: string = "";

    @Column({type: "boolean"})
    public Physics: boolean = false;

    @Column({type: "varchar", length: 2048})
    public DiscordToken: string = "";
    @Column({type: "varchar", length: 255})
    public ChannelID: string = "";

    @Column({type: "boolean"})
    public Debug: boolean = true;

    @Column({type: "boolean"})
    public Proxy: boolean = false;
    @Column({type: "varchar", length: 255})
    public ProxyType: ProxyType = ProxyType.SOCKS5;
    @Column({type: "number"})
    public AltsPerProxy: number = 1;
    @Column({type: "varchar", length: 2048})
    public ProxyFilePath: string = "";

    constructor() {

    }

    public HashCode(): string {
        let ConfigObject = {
            ServerIP : this.ServerIP,
            Port : this.Port,
            Version : this.Version,
            BotCount : this.BotCount,
            JoinSpeed : this.JoinSpeed,
            JoinCommand : this.JoinCommand,
            AccountFilePath : this.AccountFilePath,
            Physics : this.Physics,
            DiscordToken : this.DiscordToken,
            ChannelID : this.ChannelID,
            Debug: this.Debug,
            Proxy: this.Proxy,
            ProxyType: this.ProxyType,
            AltsPerProxy: this.AltsPerProxy,
            ProxyFilePath: this.ProxyFilePath
        }
        return createHash("md5").update(JSON.stringify(ConfigObject)).digest("hex");
    };

}