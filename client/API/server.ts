import * as express from "express";
import {Application} from "express";
import GET_CONFIG from "./routes/GET_CONFIG";
import EXIT_APP from "./routes/EXIT_APP";
import UPDATE_CONFIG from "./routes/UPDATE_CONFIG";
import GET_SYSTEM_USAGE from "./routes/GET_SYSTEM_USAGE";
import GET_SPECS_DATA from "./routes/GET_SPECS_DATA";
import START_BOT from "./routes/START_BOT";
import PAUSE_BOT from "./routes/PAUSE_BOT";
import STOP_BOT from "./routes/STOP_BOT";
import GET_BOT_STATUS from "./routes/GET_BOT_STATUS";
import GET_BOTS_DATA from "./routes/GET_BOTS_DATA";
import GET_BOT_MESSAGES from "./routes/GET_BOT_MESSAGES";
import DISCONNECT_BOT from "./routes/DISCONNECT_BOT";
import CONNECT_BOT from "./routes/CONNECT_BOT";
import SEND_CHAT from "./routes/SEND_CHAT";
import MOVE_BOT from "./routes/MOVE_BOT";
import CLICK_WINDOW_SLOT from "./routes/CLICK_WINDOW_SLOT";
import CLOSE_INVENTORIES from "./routes/CLOSE_INVENTORIES";
import DROP_INVENTORY from "./routes/DROP_INVENTORY";
import DROP_ITEM from "./routes/DROP_ITEM";
import DROP_SLOT from "./routes/DROP_SLOT";
import LOOK_BOT from "./routes/LOOK_BOT";
import MINE_BLOCK from "./routes/MINE_BLOCK";
import MOVE_DIRECTION from "./routes/MOVE_DIRECTION";
import PLACE_BLOCK from "./routes/PLACE_BLOCK";
import SET_HOTBAR from "./routes/SET_HOTBAR";
import USE_BLOCK from "./routes/USE_BLOCK";
import USE_HELD from "./routes/USE_HELD";
import STOP_MOVE from "./routes/STOP_MOVE";
import RESPAWN_BOT from "./routes/RESPAWN_BOT";
import GET_CHANGELOG from "./routes/GET_CHANGELOG";
import START_DISCORD_BOT from "./routes/START_DISCORD_BOT";
import STOP_DISCORD_BOT from "./routes/STOP_DISCORD_BOT";

export let port: number = 0;
export default function StartServer(): void {
  const app: Application = express();
  app.use(express.json());

  app.use('/update_config', UPDATE_CONFIG);
  app.use('/get_config', GET_CONFIG);
  app.use('/exit_app', EXIT_APP);
  app.use('/get_system_usage', GET_SYSTEM_USAGE);
  app.use('/get_specs_data', GET_SPECS_DATA);
  app.use('/start_bot', START_BOT);
  app.use('/stop_bot', STOP_BOT);
  app.use('/pause_bot', PAUSE_BOT);
  app.use('/get_bot_status', GET_BOT_STATUS);
  app.use('/get_bots_data', GET_BOTS_DATA);
  app.use('/get_bot_messages', GET_BOT_MESSAGES);
  app.use('/disconnect_bot', DISCONNECT_BOT);
  app.use('/connect_bot', CONNECT_BOT);
  app.use('/send_chat', SEND_CHAT);
  app.use('/move_bot', MOVE_BOT);
  app.use('/click_window_slot', CLICK_WINDOW_SLOT);
  app.use('/close_inventories', CLOSE_INVENTORIES);
  app.use('/drop_inventory', DROP_INVENTORY);
  app.use('/drop_item', DROP_ITEM);
  app.use('/drop_slot', DROP_SLOT);
  app.use('/look_bot', LOOK_BOT);
  app.use('/mine_block', MINE_BLOCK);
  app.use('/move_direction', MOVE_DIRECTION);
  app.use('/place_block', PLACE_BLOCK);
  app.use('/set_hotbar', SET_HOTBAR);
  app.use('/use_block', USE_BLOCK);
  app.use('/use_held', USE_HELD);
  app.use('/stop_move', STOP_MOVE)
  app.use('/respawn_bot', RESPAWN_BOT);
  app.use('/get_changelog', GET_CHANGELOG);
  app.use('/start_discord_bot', START_DISCORD_BOT);
  app.use('/stop_discord_bot', STOP_DISCORD_BOT);

  const server = app.listen(0, () => {
    // @ts-ignore
    port = server.address().port;
  });
}