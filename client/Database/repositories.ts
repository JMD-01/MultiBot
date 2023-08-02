import {Session} from "../Models/Session";
import {Repository} from "typeorm";
import {Config} from "../Models/Config";
import {Database} from "./database";

export class Repositories {
    private static _instance: Repositories;
    private readonly _SessionRepository: Repository<Session>;
    private readonly _ConfigRepository: Repository<Config>;
    private _loaded = false;

    private constructor() {
        try {
            this._SessionRepository = Database.getInstance.getDataSource().getRepository(Session);
            this._ConfigRepository = Database.getInstance.getDataSource().getRepository(Config);
            this._loaded = true;
        } catch (err) {
            this._loaded = false;
            console.log('[Database] Error while loading repositories: ' + err);
        }
    }

    public static get getInstance() {
        return this._instance || (this._instance = new this());
    }

    public getSessionRepository() {
        return this._SessionRepository;
    }

    public isLoaded() {
        return this._loaded;
    }

    public getConfigRepository() {
        return this._ConfigRepository;
    }
}