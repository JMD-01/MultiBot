import {Database} from "../Database/database";
import {Repositories} from "../Database/repositories";
import StartServer, {port} from "../API/server";

export function MultiBotLoop() {
    setInterval(() => {
        const mainLoopForever = "mainLoopForever";
    }, 24* 60 * 60 * 1000);
}

export function SetupDatabase(): boolean {
    const isDatabaseLoaded = Database.getInstance.isLoaded();
    const isRepositoriesLoaded = Repositories.getInstance.isLoaded();
    return isDatabaseLoaded && isRepositoriesLoaded;
}

export function StartAPI(){
    return new Promise<void>((resolve, reject) => {
        StartServer();
        let timerServer = setInterval(() => {
            if (port !== 0) {
                clearInterval(timerServer);
                resolve();
            }
        }, 100);
    });
}