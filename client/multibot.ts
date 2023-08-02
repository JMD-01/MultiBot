import {MultiBotLoop, SetupDatabase} from "./Setup/Setup";




async function Main(){
    //Setup main MultiBot Loop
    MultiBotLoop();
    //Setup database
    const databaseLoaded = SetupDatabase();
    if(!databaseLoaded){
        console.log("[Database] - Database not loaded! Application will not start!");
        return;
    }
}

Main();