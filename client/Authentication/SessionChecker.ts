import {Debug, Log} from "../Utils/Logger";
import {BotStatus} from "../Queue/QueueController";

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