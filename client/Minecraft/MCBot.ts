import {Session} from "./Session";
import {Bot, BotOptions, createBot} from "mineflayer";
import {Debug, Log} from "../Utils/Logger";
import {Config} from "../Models/Config";
import {GenerateUniqueID} from "../Utils/IDGenerator";
import {AuthList, BotStatus, BotsToSessionList, QueueList, SessionList} from "../Queue/QueueController";
import {ResetCounter} from "../Queue/QueueAuth";
import {Proxify, RemoveCounterProxy} from "../Proxy/ProxyController";
import {goals, Movements, pathfinder} from "mineflayer-pathfinder"
import {timer} from "../Utils/Timer";
import {Vec3} from "vec3";
import {MCInstance} from "../Instance/MCInstance";
import {Block} from "prismarine-block";

export class MCBot {
    public ID: string;
    public Email: string;
    public Password: string;
    public AccountType: string;
    public DisconnectTime: number;
    public online: boolean = false;
    public CheckedSession: boolean = false;
    public Session?: Session;
    public Bot?: Bot;
    public Messages: Array<string> = new Array<string>();

    constructor(email: string, password: string, accountType: string) {
        this.ID = GenerateUniqueID();
        this.Email = email;
        this.Password = password;
        this.AccountType = accountType;
        this.DisconnectTime = 0;
    }

    public async Connect(){
        try {
            let options: BotOptions = {
                // @ts-ignore
                session: this.Session?.ToJSON(),
                version: Config.Version,
                host: Config.ServerIP,
                port: Config.Port,
                viewDistance: "tiny",
                skipValidation: true,
                physicsEnabled: Config.Physics,
                plugins: {
                    chest: Config.Physics,
                    conversions: Config.Physics,
                    dispenser: Config.Physics,
                    enchantment_table: Config.Physics,
                    furnace: Config.Physics,
                    math: Config.Physics,
                    painting: Config.Physics,
                    scoreboard: Config.Physics,
                    villager: Config.Physics,
                    bed: Config.Physics,
                    block_actions: Config.Physics,
                    blocks: Config.Physics,
                    book: Config.Physics,
                    boss_bar: Config.Physics,
                    command_block: Config.Physics,
                    craft: Config.Physics,
                    digging: Config.Physics,
                    experience: Config.Physics,
                    physics: Config.Physics,
                    rain: Config.Physics,
                    ray_trace: Config.Physics,
                    inventory: Config.Physics,
                    simple_inventory: Config.Physics,
                    sound: Config.Physics,
                    tablist: Config.Physics,
                    time: Config.Physics,
                    title: Config.Physics,
                    entities: Config.Physics
                }
            }
            this.Bot = createBot(Config.Proxy ? await Proxify(options, this.ID) : options); //Create Bot instance using options and connect to server using proxy if needed
            const defaultMove = Config.Physics ? new Movements(this.Bot,MCInstance.getInstance().McData(Config.Version)) : null; //Add movements if Physics is enabled
            //Check if Physics is enabled and defaultMove isn't null
            if(Config.Physics && defaultMove !== null){
                defaultMove.allow1by1towers = false; //No building
                defaultMove.canDig = false; //No digging
                defaultMove.maxDropDown = 5; //Max dropdown
                pathfinder(this.Bot); //Inject pathfinder into bot
            }
            //Login event and startup functions
            this.Bot.once("login",()=>{
                if(this.Bot === undefined) return; //Return if Bot doesn't exist
                this.online = true; //Set online to true
                this.SendChat(Config.JoinCommand); //Send join command
                Log(`Logged in: ${this.Bot._client.username}`);
                //Check if all Lists are empty to indicate all bots logged in or handled
                if(SessionList.length === 0 && AuthList.length === 0 && QueueList.length === 0 && BotStatus){
                    Log(`All bots logged in!`);
                    ResetCounter(); //Reset invalid counter so on disconnect it doesn't skip using sessions
                }
                if (Config.Physics && defaultMove !== null) this.Bot.pathfinder.setMovements(defaultMove);//Load set movements
                let macro = setInterval(()=>{
                    if(this.Bot === undefined) {
                        clearInterval(macro);
                    } else {
                        this.SendChat(Config.JoinCommand); //Send join command
                    }

                },100000);
            });
            //Kicked event and add termination of bot and re-authentication
            this.Bot.on("kicked",(reason) =>{
                if(this.Bot === undefined) return; //Return if Bot already invalid
                this.online = false; //Set online to false
                let username = this.Bot._client.username; //Define username so we can delete instance of Bot
                this.Bot.removeAllListeners(); //Remove all listeners
                this.Bot = undefined; //Delete bot instance
                this.DisconnectTime = Math.floor(Date.now() / 1000); //Update disconnect time for Auth checking
                BotsToSessionList(this.ID); //Move this Bot instance to SessionList to go thru the Checking and Queue process
                if(Config.Proxy) RemoveCounterProxy(this.ID); //Remove proxy from Bot if exists
                Log(`Kicked: ${username} for ${reason}`);
            });
            //End event and add termination of bot and re-authentication
            this.Bot.on("end",()=>{
                if(this.Bot === undefined) return; //Return if Bot already invalid
                this.online = false; //Set online to false
                let username = this.Bot._client.username; //Define username so we can delete instance of Bot
                this.Bot.removeAllListeners(); //Remove all listeners
                this.Bot = undefined; //Delete bot instance
                this.DisconnectTime = Math.floor(Date.now() / 1000); //Update disconnect time for Auth checking
                BotsToSessionList(this.ID); //Move this Bot instance to SessionList to go thru the Checking and Queue process
                if(Config.Proxy) RemoveCounterProxy(this.ID); //Remove proxy from Bot if exists
                Log(`Disconnected: ${username}`);
            });
            //Message event with json of chat
            this.Bot.on("message", json => {
                let message = "";
                if (json.extra != null) {
                    json.extra.forEach(text => {
                        if (text != null) {
                            message += text;
                        }
                    });
                }
                this.AddMessage(message);
            });
            // @ts-ignore //PathFinder goal reached
            this.Bot.on('goal_reached',()=>{
                //Log("Reached");
            })
        } catch (err) {
            console.log(err);
        }

    }

    public Disconnect(){
        if(this.Bot === undefined) return; //Return if Bot already invalid
        try{
            this.Bot.quit(); //Exit server
            this.Bot.removeAllListeners(); //Remove all listeners
            this.Bot = undefined; //Delete bot instance
            this.online = false; //Set online to false
        }catch (err) {
            Debug(`${err}`);
        }
    }

    public SendChat(message: string){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        try {
            this.Bot.chat(message); //Send message to server
        }catch (err) {
            Debug(`${err}`);
        }
    }

    private AddMessage(message: string){
        if(message !== ""){
            this.Messages.push(message); //Add message to
            //Check if messages Length
            if(this.Messages.length > 250){
                this.Messages.splice(0,this.Messages.length - 250); //Remove messages exceeding 250
            }
        }
    }
    public async LookUp(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(this.Bot.entity.yaw,Math.PI/2); //Look Up while using current yaw
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async LookDown(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(this.Bot.entity.yaw,-(Math.PI/2)); //Look Down while using current yaw
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async LookSouth(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(180*Math.PI/180,0);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async LookNorth(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(0,0);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async LookWest(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(90*Math.PI/180,0);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async LookEast(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.look(270*Math.PI/180,0);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async MoveForward(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.setControlState('forward',true);
            await timer(500);
            this.Bot.setControlState('forward',false);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async MoveBack(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.setControlState('back',true);
            await timer(500);
            this.Bot.setControlState('back',false);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async MoveLeft(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.setControlState('left',true);
            await timer(500);
            this.Bot.setControlState('left',false);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async MoveRight(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.setControlState('right',true);
            await timer(500);
            this.Bot.setControlState('right',false);
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public Move(x: number, y: number, z: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.pathfinder.setGoal(new goals.GoalBlock(x,y,z)); //Move to block position
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public StopMove(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.pathfinder.stop(); //Stop all movements
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public Respawn(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot._client.write('client_command', { payload: 0 }); //Execute respawn command
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async DropSlot(slotID: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.clickWindow(slotID, 0, 0); //Click item select
            await this.Bot.clickWindow(-999, 0, 0); //Unclick item select dropping it
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async DropItem(ItemID: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let window = this.Bot.currentWindow || this.Bot.inventory; //Get current window
            this.Bot.closeWindow(window); //Close current window or inventory
            //Loop thru all slots available
            for (let slot of this.Bot.inventory.slots) {
                //Check if there is an item in slot and has the same ID as specified
                if(slot !== null && slot.type === ItemID){
                    await this.Bot.clickWindow(slot.slot, 0, 0); //Click item select
                    await this.Bot.clickWindow(-999, 0, 0); //Unclick item select dropping it
                    await timer(300); //Timer to pause for loop
                }
            }
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async DropInventory(delay: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let window = this.Bot.currentWindow || this.Bot.inventory; //Get current window
            this.Bot.closeWindow(window); //Close current window or inventory
            //Loop thru all slots available
            for (let slot of this.Bot.inventory.slots) {
                //Check if there is an item in slot
                if(slot !== null){
                    await this.Bot.clickWindow(slot.slot, 0, 0); //Click item select
                    await this.Bot.clickWindow(-999, 0, 0); //Unclick item select dropping it
                    await timer(delay); //Timer to pause for loop
                }
            }
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public SetHotBarSlot(slotID: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            //Check if slotID is valid hotbar slot
            if(slotID >= 0 && 8 >= slotID){
                this.Bot.setQuickBarSlot(slotID); //Select hotbar slot
            }
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public UseHeld(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            this.Bot.activateItem(); //Use item
        }catch (err) {
            Debug(`-${err}`);
        }
    }

    public GetInventory(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            interface Slot {
                slot: number;
                id: number;
                count: number;
                name: string;
                displayName: string;
            }
            let output: Slot[] = new Array<Slot>(); //Create output array
            let window = this.Bot.currentWindow || this.Bot.inventory; //Get current window
            //Loop thru all slots available
            for (let slot of window.slots) {
                //Check if there is an item in slot
                if(slot !== null){
                    output.push({
                        slot: slot.slot,
                        id: slot.type,
                        count: slot.count,
                        name: slot.name,
                        displayName: slot.displayName
                    }); //Add slot to output
                }
            }
            return output; //Return output
        }catch (err) {
            console.log(err)
        }
    }

    public async GetSlot(slotID: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let output: any = {}; //Create output array
            let window = this.Bot.currentWindow || this.Bot.inventory; //Get current window
            //Loop thru all slots available
            for (let slot of window.slots) {
                //Check if there is an item in slot and has the same ID as specified
                if(slot !== null && slot.slot === slotID){
                    output = slot; //Add slot to output
                }
            }
            return output; //Return output
        }catch (err) {
            console.log(err)
        }
    }

    public async ClickWindowSlot(slotID: number, clickButton: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            await this.Bot.clickWindow(slotID, clickButton, 0); //Click item select
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public CloseInventories(){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let window = this.Bot.currentWindow || this.Bot.inventory; //Get current window
            this.Bot.closeWindow(window); //Close current window or inventory
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public UseBlock(x: number, y: number, z: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let Block = this.Bot.blockAt(new Vec3(x,y,z)); //Get Block from position
            //Check if block is in range or valid and not AIR
            if(Block !== null && Block.type !== 0){
                this.Bot.activateBlock(Block); //Activate the block
            }
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public MineBlock(x: number, y: number, z: number){
        if(this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let Block = this.Bot.blockAt(new Vec3(x,y,z)); //Get Block from position
            //Check if block is in range or valid and not AIR
            if(Block !== null && Block.type !== 0){
                this.Bot.dig(Block); //Mine the block
            }
        }catch (err) {
            Debug(`-${err}`);
        }
    }
    public async PlaceBlock(x: number, y: number, z: number) {
        if (this.Bot === undefined) return; //Return if Bot doesn't exist
        if(!Config.Physics) return; //Check if physics and world loading is enabled
        try {
            let BlockPlace = this.Bot.blockAt(new Vec3(x, y, z)); //Get block at position
            //Check if block is in range and valid
            if (BlockPlace !== null) {
                let pos: Vec3 = BlockPlace.position //Get Position of block
                //Check Block Faces if can be placed off
                switch (true) {
                    //UP FACE
                    case (this.Bot.blockAt(pos.offset(0, -1, 0)) !== null && this.Bot.blockAt(pos.offset(0, -1, 0))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(0, -1, 0)), new Vec3(0, 1, 0));
                        break;
                    //DOWN FACE
                    case (this.Bot.blockAt(pos.offset(0, 1, 0)) !== null && this.Bot.blockAt(pos.offset(0, 1, 0))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(0, 1, 0)), new Vec3(0, -1, 0));
                        break;
                    //NORTH FACE
                    case (this.Bot.blockAt(pos.offset(0, 0, -1)) !== null && this.Bot.blockAt(pos.offset(0, 0, -1))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(0, 0, -1)), new Vec3(0, 0, 1));
                        break;
                    //SOUTH FACE
                    case (this.Bot.blockAt(pos.offset(0, 0, 1)) !== null && this.Bot.blockAt(pos.offset(0, 0, 1))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(0, 0, 1)), new Vec3(0, 0, -1));
                        break;
                    //WEST FACE
                    case (this.Bot.blockAt(pos.offset(1, 0, 0)) !== null && this.Bot.blockAt(pos.offset(1, 0, 0))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(1, 0, 0)), new Vec3(-1, 0, 0));
                        break;
                    //EAST FACE
                    case (this.Bot.blockAt(pos.offset(-1, 0, 0)) !== null && this.Bot.blockAt(pos.offset(-1, 0, 0))?.name.toUpperCase() !== "AIR"):
                        await this.Bot.placeBlock(<Block>this.Bot.blockAt(pos.offset(-1, 0, 0)), new Vec3(1, 0, 0));
                        break;
                }
            }
        } catch (err) {
            Debug(`-${err}`);
        }
    }

    public GetBotInfo(){
        if (this.Bot === undefined) return; //Return if Bot doesn't exist
        try {
            return {
                name: this.Bot._client.username,
                ping: this.Bot._client.latency
            }
        }catch (err) {
            Debug(`-${err}`);
            return;
        }
    }

}
