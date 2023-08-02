import {existsSync, readFileSync} from 'fs';
import {Account} from '../Models/Account';
import {FileNotFoundException} from '../Models/Exceptions/FileNotFoundException';

/**
 *
 * @param filePath - The filepath to the account text file : string
 * @return AccountList - The Array of AccountDetails : AccountDetail[]
 */
export function ReadAccountList(filePath: string):Array<AccountDetail>{
    let AccountList: AccountDetail[] = new Array<AccountDetail>();
    for (let accountDetail of ReadFileLines(filePath)) {
        let detail = accountDetail.trim().split(":");
        //Mojang account
        if(detail.length == 2){
            AccountList.push(new AccountDetail(detail[0],detail[1]));
        }
        //Microsoft account
        if(detail.length == 3){
            if(detail[2].toUpperCase() == "MICROSOFT"){
                AccountList.push(new AccountDetail(detail[0], detail[1], "Microsoft"));
            }
        }
    }
    return AccountList;
}

/**
 *
 * @param filePath - The filepath to the account text file : string
 * @return LineArray - The array containing each line in a text file : string[]
 */
function ReadFileLines(filePath: string):Array<string>{
    if(!existsSync(filePath)){
        throw new FileNotFoundException(`${filePath} does not exist!`);
    }
    let data: string = readFileSync(filePath,'utf-8');
    return data.split(/\r?\n/);
}
