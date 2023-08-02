import {authenticate} from "./xboxlive-auth";
import {XboxReplayError} from "@xboxreplay/errors";
import {Session} from "../Objects/Session";
import {Debug, Log} from "../Utils/Logger";
import * as fetch from "node-fetch";
import {UpdateSession} from "../../Data/DatabaseReader/SessionDB";

const Constants = {
    XSTSRelyingParty: 'rp://api.minecraftservices.com/',
    MinecraftServicesLogWithXbox: 'https://api.minecraftservices.com/authentication/login_with_xbox',
    MinecraftServicesEntitlement: 'https://api.minecraftservices.com/entitlements/mcstore',
    MinecraftServicesProfile: 'https://api.minecraftservices.com/minecraft/profile'
}

export async function LoginMicrosoft(email:string, password:string):Promise<Session|null> {
    //Session to return
    let session = null;
    //Header for requests
    let getFetchOptions = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'node-minecraft-protocol',
        }
    }
    try {
        //Xbox Auth
        let XAuthResponse = await authenticate(email, password, { XSTSRelyingParty: Constants.XSTSRelyingParty });
        //MineService Auth
        const MineServicesResponse = await fetch.default(Constants.MinecraftServicesLogWithXbox, {
            method: 'post',
            ...getFetchOptions,
            body: JSON.stringify({ identityToken: `XBL3.0 x=${XAuthResponse.userHash};${XAuthResponse.XSTSToken}` })
        }).then(checkStatus);
        // @ts-ignore
        getFetchOptions.headers.Authorization = `Bearer ${MineServicesResponse.access_token}`
        const MineEntitlements = await fetch.default(Constants.MinecraftServicesEntitlement, getFetchOptions).then(checkStatus)
        if (MineEntitlements.items.length === 0) throw Error('This user does not have any items on its accounts according to minecraft services.');

        let minecraftProfile
        const res = await fetch.default(Constants.MinecraftServicesProfile, getFetchOptions);
        if (res.ok) { // res.status >= 200 && res.status < 300
            minecraftProfile = await res.json()
        } else {
            throw Error(`Failed to obtain Minecraft profile data for '${email}', does the account own Minecraft Java? Server returned: ${res.statusText}`);
        }

        if (!minecraftProfile.id) {
            throw Error('This user does not own minecraft according to minecraft services.');
        }
        //Create new session
        session = new Session(email,MineServicesResponse.access_token, "", minecraftProfile.name, minecraftProfile.id,"Microsoft");
        UpdateSession(session);
        Log(`[2/2]${email} - Authenticated!`);

    } catch (err) {
        session = null;
        if(err instanceof XboxReplayError){
            let error : XboxReplayError = err;
            switch (error.details.reason) {
                //Unauthorized account errors
                case "UNAUTHORIZED":
                    //Invalid credentials
                    if(error.message.includes("Invalid credentials")){
                        Log(`[!]${email} - Failed Login : Invalid credentials!`);
                        Debug(`-${error.stack}`);
                    //Unusual activity detected error
                    }else if(error.message.includes("Activity confirmation required, please refer to")){
                        Log(`[!]${email} - Failed Login : Activity confirmation required!`);
                        Debug(`-${error.stack}`);
                    //2FA enabled error
                    }else if(error.message.includes("Invalid credentials or 2FA enabled, please refer to ")){
                        Log(`[!]${email} - Failed Login : Invalid credentials or 2FA enabled!`);
                        Debug(`-${error.stack}`);
                    //Extra confirmation error
                    }else if(error.message.includes("2FA enabled or requires ")){
                        Log(`[!]${email} - Failed Login: 2FA enabled or requires confirmation!`);
                        Debug(`-${error.stack}`);
                    }else{
                    //Default error
                        Log(`[!]${email} - Failed Login : ${error.message}`);
                        Debug(`-${error.stack}`);
                    }
                    break;
                //Internal account errors
                case "INTERNAL":
                    Log(`[!]${email} - INTERNAL : ${error.message}`);
                    Debug(`-${error.stack}`);
                    break;
                //Bad request account errors
                case "BAD_REQUEST":
                    Log(`[!]${email} - BAD_REQUEST : ${error.message}`);
                    Debug(`-${error.stack}`);
                    break;
                //Forbidden account errors
                case "FORBIDDEN":
                    Log(`[!]${email} - FORBIDDEN : ${error.message}`);
                    Debug(`-${error.stack}`);
                    break;
                //Internal server error
                case "INTERNAL_SERVER_ERROR":
                    //No internet connection or cannot connect to the server
                    if(error.message === "getaddrinfo ENOTFOUND login.live.com"){
                        Log(`[!]${email} - CONNECTION ERROR : No internet or unable to connect to microsoft servers!`);
                        Debug(`-${error.stack}`);
                    //Default internal server error
                    }else {
                        Log(`[!]${email} - INTERNAL_SERVER_ERROR : ${error.message}`);
                        Debug(`-${error.stack}`);
                    }
                    break;
                //Default error
                default:
                    Log(`[!]${email} - XBOXLIVE-ERROR : ${error.message}`);
                    Debug(`-${error.stack}`);
                    break;
            }
        //No items on account
        } else if(err.message === 'This user does not have any items on its accounts according to minecraft services.'){
            Log(`[!]${email} - Failed Login : This user does not own Minecraft!`);
            Debug(`-${err.stack}`);
        //Doesnt own minecraft java
        } else if(err.message.includes('does the account own Minecraft Java? Server returned:')){
            Log(`[!]${email} - Failed Login : This user does not own Minecraft!`);
            Debug(`-${err.stack}`);
        //Doesnt own minecraft
        } else if(err.message === 'This user does not own minecraft according to minecraft services.'){
            Log(`[!]${email} - Failed Login : This user does not own Minecraft!`);
            Debug(`-${err.stack}`);
        //Default Microsoft Auth error
        } else {
            Log(`[!]${email} - ERROR : ${err.message}`);
            Debug(`-${err.stack}`);
        }

    }finally {
        return session;
    }

}
//Check status
function checkStatus (res: any) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res.json();
    } else {
        throw Error(res.statusText);
    }
}

