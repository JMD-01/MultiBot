import {ReadAccountList} from "../Authentication/AccountReader";
import {Config} from "../Models/Config";
import {AccountDetail} from "../Models/Account";
import {MCBot} from "../Minecraft/MCBot";
import * as QueueAuth from "./QueueAuth";
import {Log} from "../Utils/Logger";
import {LoadProxies} from "../Proxy/ProxyController";
import {MCInstance} from "../Instance/MCInstance";


export let Bots: Array<MCBot> = new Array<MCBot>(); //Stores MCBots that are logged in server
export let QueueList: Array<MCBot> = new Array<MCBot>(); //Stores MCBots waiting to be logged in server
export let AuthList: Array<MCBot> = new Array<MCBot>(); //Stores MCBots waiting to be Authenticated
export let SessionList: Array<MCBot> = new Array<MCBot>(); //Stores MCBots waiting to be SessionChecked or moved to Authentication
export let Timers: Array<NodeJS.Timer|NodeJS.Timeout> = new Array<NodeJS.Timer|NodeJS.Timeout>(); //All timers stored in one array for easy removal
export let BotStatus: boolean = false; //If bot is On or Off
export let Paused: boolean = false; //Paused variable

/**
* Starts QueueSystem and Bot Login System
* @return {boolean|null} Returns true if bot successfully started and false if bot already started and null if error occurred
*/
export function Start(): boolean|null{
    try {
        //Check if already started
        if(BotStatus){
            return false; //Return false bot already started
        }
        MCInstance.getInstance();
        BotStatus = true; //Enable Bot
        Paused = false; //Disable Pause
        ClearData(); //Reset all data
        let Accounts: Array<AccountDetail> = ReadAccountList(Config.AccountFilePath); //Get Account Details
        //Initialize MCBot and add to SessionList
        for (let Account of Accounts) {
            //Check if we are pushing more than BotCount specified
            if(SessionList.length >= Config.BotCount){
                break; //Stop the loop
            }
            SessionList.push(new MCBot(Account.Email, Account.Password, Account.AccountType)); //Push new MCBot object to SessionList
        }
        if(Config.Proxy) LoadProxies(); //Load proxies if needed
        QueueAuth.Start(); //Start auth and login process
        console.log("Starting Bot");
        return true; //Return true bot successfully started
    }catch (err) {
        Log(err);
        BotStatus = false; //Disable Bot
        return null; //Return null bot failed to start or crashed
    }
}

/**
 * Stops QueueSystem and Bot Login System
 * @return {boolean|null} Returns true if bot successfully stopped and false if bot already stopped or not running and null if error occurred
 */
export function Stop(): boolean|null{
    try {
        //Check if already started
        if(!BotStatus){
            return false; //Return false bot already turned off
        }
        BotStatus = false; //Disable Pause
        Paused = false; //Disable Pause
        QueueAuth.Stop(); //Stop Queue and Auth process
        console.log("Stopping Bot");
        return true; //Return true successfully stopped bot
    }catch (err) {
        Log(err);
        ClearData(); //Reset all data
        return null; //Return null bot failed to stop or crashed
    }
}

/**
 * Pauses or unpauses the Queue and Bot system if Bot running
 * @return {boolean|null} Returns true if paused, false if unpaused and null if bot not running
 * or error occurred
 **/
export function Pause():boolean|null{
    try {
        //Check if Bot is online before pausing or unpausing
        if(!BotStatus){
            return null; //Return null bot is offline cannot pause or unpause
        }
        Paused = !Paused; //Change Pause status around
        QueueAuth.Pause(); //Pause QueueAuth
        console.log(Paused ? "Paused Bot" : "Unpaused Bot");
        return Paused; //Return true for is NOW paused, false for no longer paused
    }catch (err) {
        Log(err);
        return null; //Return null error occurred while trying to pause or unpause
    }

}

/**
* Moves MCBot object to SessionList when they disconnect
* @param {string} BotID Input ID of the MCBot to move
*/
export function BotsToSessionList(BotID: string):void{
    let indexBot = Bots.findIndex(bot => bot.ID === BotID); //Get index of bot matching ID
    let currentBot: MCBot|undefined = Bots.splice(indexBot !== -1 ? indexBot : 0, indexBot !== -1 ? 1 : 0).shift(); //Finds MCBot matching ID and get first entry
    //Check if first entry of MCBot is valid
    if(currentBot != undefined){
        SessionList.push(currentBot); //Push to SessionList
    }
}

/**
* Clears all Data in Arrays used to store MCBots
*/
export function ClearData(): void{
    Bots.length = 0;
    QueueList.length = 0;
    AuthList.length = 0;
    SessionList.length = 0;
}


