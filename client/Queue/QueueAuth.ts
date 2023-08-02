import {clearInterval} from "timers";
import {Debug, Log} from "../Utils/Logger";
import {Config} from "../Models/Config";
import {CheckSession} from "../Authentication/MojangAuth";
import {Session} from "../Objects/Session";
import {MCBot} from "../Minecraft/MCBot";
import {Login} from "../Authentication/Auth";
import {AuthList, Bots, BotStatus, ClearData, Paused, QueueList, SessionList} from "./QueueController";


let SessionStatus: boolean = false;
let AuthStatus: boolean = false;
let QueueStatus: boolean = false;
let InvalidCounter: number = 0;
let ClientTicker: NodeJS.Timer;
let TimeoutsList: Array<NodeJS.Timeout> = new Array<NodeJS.Timeout>();
let IntervalsList: Array<NodeJS.Timer> = new Array<NodeJS.Timer>();

export function Start():void{
    ClientTicker = setInterval(()=>{ //Timer 20 times a second
        if(BotStatus && !Paused){ //Check if Bot is running and not paused to execute selected methods for timer
            try {
                SessionRunner();
                AuthRunner();
                QueueRunner();
            }catch (err) {
                if(err.message != "Bot is disabled, cancelling all async functions"){
                    Debug(`-${err.stack}`);
                }
                //Debug(`-${err.stack}`);
            }
        }
    },50);
}

export function Stop():void{
    clearInterval(ClientTicker); //Stop Timer
    setTimeout(()=>{
        SessionStatus = false;
        AuthStatus = false;
        QueueStatus = false;
        InvalidCounter = 0;
        TimeoutsList.length = 0;
        IntervalsList.length = 0;
        SessionList.length = 0;
        AuthList.length = 0;
        QueueList.length = 0;
        for (let bot of Bots) {
            bot.Disconnect();
        }
        Bots.length = 0;
        ClearData();
    },100);
}

export function Pause():void{
    QueueStatus = Paused;
    AuthStatus = Paused;
    SessionStatus = Paused;
}

async function SessionRunner():Promise<void>{
    if(SessionStatus) return; //Check if process is already currently running an Session Validator check
    if(Bots.length >= Config.BotCount) return; //Check if goes over BotCount
    if(SessionList.length > 0){ //Check if Session is not empty
        if(AuthList.length > 0) return; //If account available to auth stop checking until its done
        let CurrentBot = <MCBot>SessionList.shift(); //Get first entry of SessionList to use for checking
        //Check if has been atleast 30 seconds since disconnect time to rerun authing process
        if(Math.floor(Date.now() /1000) < CurrentBot.DisconnectTime + 30) {
            SessionList.push(CurrentBot); //Add object back to SessionList
            return;
        }
        SessionStatus = true; //Enable SessionStatus marking that an account is being handled
        //Invalid accounts exceed 3, skip checking old sessions
        if(InvalidCounter > 3){
            //Send notification of too many invalid sessions
            if(InvalidCounter === 4) {
                InvalidCounter++;
                Log(`[!] Too many invalid sessions. Skipping sessions to avoid Mojang block!`);
            }
            Log(`[1/2] ${CurrentBot.Email} : Skipping Session.`); //Skip sessions
            CurrentBot.Session = undefined; //Delete previous session
            AuthList.push(CurrentBot); //Push to Auth List
            setTimeout(()=>{
                SessionStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
            },Config.JoinSpeed);

        } else {
            let SessionResponse: Session | boolean | null = await CheckSession(CurrentBot.Email);//CheckSession
            //Valid session found
            if(SessionResponse instanceof Session){
                CurrentBot.Session = SessionResponse; //Assign Session
                CurrentBot.CheckedSession = true; //Checked the session so assign true
                QueueList.push(CurrentBot); //Add MCBot to QueueList
                setTimeout(()=>{
                    SessionStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
                },Config.JoinSpeed);
            }
            //Session not found
            if(SessionResponse === null){
                CurrentBot.Session = undefined; //Delete Session
                CurrentBot.CheckedSession = false; //Uncheck session so assign false
                AuthList.push(CurrentBot); //Push to Auth List
                setTimeout(()=>{
                    SessionStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
                },Config.JoinSpeed);
            }
            //Session invalid
            if(SessionResponse === false){
                InvalidCounter++;
                CurrentBot.Session = undefined; //Delete Session
                CurrentBot.CheckedSession = false; //Uncheck session so assign false
                CurrentBot.DisconnectTime = Math.floor(Date.now() /1000) - 25; //Wait atleast 5 seconds until authenticating this account
                AuthList.push(CurrentBot); //Push to Auth List
                setTimeout(()=>{
                    SessionStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
                },Config.JoinSpeed);
            }
        }
    }
}

async function AuthRunner():Promise<void>{
    if(AuthStatus) return; //Check if process is already currently running an Auth Runner check
    if(Bots.length >= Config.BotCount) return; //Check if goes over BotCount
    if(AuthList.length > 0){ //Check if AuthList is not empty
        let CurrentBot: MCBot = <MCBot>AuthList.shift(); //Get first entry of AuthList MCBot for authing
        //Check if has been atleast 30 seconds since disconnect time to rerun authing process
        if(Math.floor(Date.now() /1000) < CurrentBot.DisconnectTime + 30) {
            AuthList.push(CurrentBot); //Add object back to AuthList
            return;
        }
        AuthStatus = true; //Enable AuthStatus
        let SessionResponse: Session | null = await Login(CurrentBot.Email, CurrentBot.Password, CurrentBot.AccountType);//Login Account
        //Successfully Authenticated
        if(SessionResponse instanceof Session){
            CurrentBot.Session = SessionResponse; //Assign Session
            CurrentBot.CheckedSession = true; //Checked the session so assign true
            QueueList.push(CurrentBot); //Add MCBot to QueueList
            setTimeout(()=>{
                AuthStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
            },Config.JoinSpeed);
        }
        //Not able to Authenticate
        if(SessionResponse === null){
            CurrentBot.Bot = undefined; //Do nothing with MCBot object and destroy
            //Check if all Lists are empty to determine if all bots logged in
            if(SessionList.length === 0 && AuthList.length === 0 && QueueList.length === 0 && BotStatus){
                Log(`All bots logged in!`);
                ResetCounter(); //Reset invalid counter so on disconnect it doesn't skip using sessions
            }
            setTimeout(()=>{
                AuthStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
            },Config.JoinSpeed);
        }
    }
}

async function QueueRunner():Promise<void>{
    if(QueueStatus) return; //Check if process is already currently running an QueueRunner Login
    if(Bots.length >= Config.BotCount) return; //Check if goes over BotCount
    if(QueueList.length > 0){ //Check if QueueList is not empty
        let CurrentBot: MCBot = <MCBot>QueueList.shift(); //Get first entry of QueueList MCBot for Login Server
        //Check if has been atleast 30 seconds since disconnect time to rerun authing process
        if(Math.floor(Date.now() /1000) < CurrentBot.DisconnectTime + 30) {
            QueueList.push(CurrentBot); //Add object back to QueueList
            return;
        }
        QueueStatus = true; //Enable QueueStatus
        await CurrentBot.Connect(); //Create Bot and connect to server
        Bots.push(CurrentBot); //Add bot to Bots list
        setTimeout(()=>{
            QueueStatus = (!(BotStatus && !Paused)); //Check if bot is running and not paused before doing action
        },Config.JoinSpeed);
    }
}

export function ResetCounter():void{
    InvalidCounter = 0;
}
