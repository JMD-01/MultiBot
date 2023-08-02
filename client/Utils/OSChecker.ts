import {dirname} from "path";
import {Log} from "./Logger";

/**
 * Determine OS and set file paths and correct variables
 */
export let filepath = './'; //default path
if(process.platform.trim() === 'win32'){
    Log('Windows detected');
    filepath = './';
} else if(process.platform.trim() === 'linux'){
    Log('Linux detected');
    filepath = './';
}else if(process.platform.trim() === 'darwin'){
    Log('MacOS detected')
    filepath = `${dirname(process.execPath)}/`
}