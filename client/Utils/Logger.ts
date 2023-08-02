import {Config} from "../Models/Config";

export function Log(message: any):void {
    console.log(message);
}
export function Debug(message: any):void {
    if(Config.Debug){
        console.log(`Debug: ${message}`);
    }
}