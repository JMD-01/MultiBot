import {DataSource} from "typeorm";
import {Session} from "../Models/Session";
import {Config} from "../Models/Config";


export class Database {

    private static _instance: Database;
    private _AppDataSource: DataSource;
    private _loaded = false;

    private constructor() {
        this._AppDataSource = new DataSource({
            type: "sqlite",
            database: "database.db",
            synchronize: true,
            logging: false,
            entities: [
                Session,
                Config
            ],
        });
        this._AppDataSource.initialize()
            .then(() => {
                console.log("[Database] Datasource initialized");
                this.checkFirstRun();
            })
            .catch((err) => {
                console.error("[Database] Error during Datasource initialization", err)
                this._loaded = false;
            })
    }

    public static get getInstance() {
        return this._instance || (this._instance = new this());
    }

    public getDataSource() {
        return this._AppDataSource;
    }

    public isLoaded() {
        return this._loaded;
    }

    private checkFirstRun() {
        this._AppDataSource.getRepository(Config)
            .find()
            .then((config) => {
                if (config.length === 0) {
                    this._AppDataSource.getRepository(Config)
                        .save(new Config())
                        .then(() => {
                            console.log("[Database] You are running MultiBot for the first time, settings have been set to default");
                            this._loaded = true;
                        })
                        .catch((err) => {
                            console.error("[Database] Error creating default config", err);
                            this._loaded = false;
                        })
                } else {
                    this._loaded = true;
                }
            })
            .catch((err) => {
                console.error("[Database] Error checking first run", err);
                this._loaded = false;
            })
    }
}