import {Session} from "../Objects/Session";
import {Client} from 'yggdrasil/es6'
import {GetSession, UpdateSession} from "../../Data/DatabaseReader/SessionDB";
import {Debug, Log} from "../Utils/Logger";
import {BotStatus} from "../Queue/QueueController";
import jwtDecode, {JwtPayload} from "jwt-decode";

export async function LoginMojang(email: string, password: string, clientToken: any):Promise<Session|null>{
    try {
       let response: any = await Client.auth({
           user: email,
           pass: password,
           token: clientToken,
           version: "1"
       });
        Log(`[2/2]${email} - Authenticated!`);
        let session: Session = new Session(email, response.accessToken, response.clientToken, response.selectedProfile.name, response.selectedProfile.id, "Mojang");
        UpdateSession(session);
        return session;
    }catch (err) {
        if(err.message === "Invalid credentials. Invalid username or password."){
            Log(`[!]${email} - Invalid credentials. Possible mojang block!`);
        }
        return null;
    }

}

export async function CheckSession(email:string):Promise<Session|boolean|null>{
    return new Promise(async (resolve, reject) => {
        let session: Session | null = GetSession(email);
        if (session === null) {
            //Session not found
            Log(`[1/2]${email} - Session not found!`);
            if (BotStatus) {
                //Return the valid session
                return resolve(null);
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        }
        //Check session with token
        try {
            //Different methods for checking for microsoft vs mojang
            if(session.AccountType.toUpperCase() === "MICROSOFT"){
                //Decode JWT token to determine expiring date
                let decodedJWT: JwtPayload = jwtDecode<JwtPayload>(session.AccessToken);
                // @ts-ignore //Check if token expired
                if((decodedJWT["exp"] -1000) < Math.floor(Date.now() /1000)){
                    throw new Error("Token expired!");
                }
            }else {
                //Check accessToken if valid
                let response = await Client.validate(session.AccessToken);
            }
            Log(`[2/2]${email} - Valid Session found!`);
            if (BotStatus) {
                //Return the valid session
                return resolve(new Session(session.Email, session.AccessToken, session.ClientToken, session.Name, session.ID, session.AccountType));
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        } catch (err) {
            Log(`[1/2]${email} - Session invalid!`);
            Debug(`-${email} -${err.stack}`);
            if (BotStatus) {
                //Return false for invalid session
                return resolve(false);
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        }
    });

}