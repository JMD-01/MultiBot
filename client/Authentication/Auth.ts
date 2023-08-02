import {LoginMicrosoft} from "./MicrosoftAuth";
import {LoginMojang} from "./MojangAuth";
import {Session} from "../Objects/Session";
import {BotStatus} from "../Queue/QueueController";

export async function Login(Email: string, Password: string, AccountType: string):Promise<Session | null>{
    return new Promise(async (resolve, reject) => {
        if (AccountType == "Microsoft" && BotStatus) {
            let response: Session | null = await LoginMicrosoft(Email, Password);
            if(BotStatus){
               return resolve(response);
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        } else if (AccountType == "Mojang" && BotStatus) {
            let response: Session | null = await LoginMojang(Email, Password, null);
            if(BotStatus){
                return resolve(response);
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        } else {
            if(BotStatus){
                return resolve(null);
            }
            return reject(new Error("Bot disabled, cancelling async function"));
        }
    });
}