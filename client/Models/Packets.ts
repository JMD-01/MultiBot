import {Config} from "./Config";

export function GetPacketWhitelist(): Array<number>{
    if(Config.Physics){
        let whitelist: Array<number> = new Array<number>();
        whitelist.push(...[
            0, //disconnect , keep_alive
            1, //encryption_begin, login
            2, //chat, success
            3, //compress, update_time
            4, //entity_equipment
            5, //spawn_position
            6, //update_health
            7, //respawn
            8, //position
            9, //held_item_slot
            10, //
            11, //animation
            12, //named_entity_spawn
            13, //
            14, //spawn_entity
            15, //spawn_entity_living
            16, //
            17, //
            18, //entity_velocity
            19, //entity_destroy
            20, //
            21, //rel_entity_move
            22, //entity_look
            23, //entity_move_look
            24, //entity_teleport
            25, //entity_head_rotation
            26, //entity_status
            27, //attach_entity
            28, //entity_metadata
            29, //entity_effect
            30, //
            31, //experience
            32, //update_attributes
            33, //map_chunk
            34, //
            35, //block_change
            36, //block_action
            37, //
            38, //map_chunk_bulk
            39, //
            40, //world_event
            41, //named_sound_effect
            42, //world_particles
            43, //game_state_change
            44, //
            45, //
            46, //
            47, //set_slot
            48, //window_items
            49, //
            50, //
            51, //update_sign
            52, //map
            53, //tile_entity_data
            54, //
            55, //statistics
            56, //player_info
            57, //abilities
            58, //
            59, //scoreboard_objective
            60, //scoreboard_score
            61, //scoreboard_display_objective
            62, //scoreboard_team
            63, //custom_payload
            64, //kick_disconnect
            65, //difficulty
            66, //
            67, //
            68, //world_border
            69, //title
            70, //set_compression
            71, //playerlist_header
        ])
        return whitelist;
    } else {
        let whitelist: Array<number> = new Array<number>();
        whitelist.push(...[
            0, //disconnect , keep_alive
            1, //encryption_begin, login
            2, //chat, success
            3, //compress, update_time
            63, //custom_payload
            64, //kick_disconnect
            70, //set_compression
        ])
        return whitelist;
    }
}