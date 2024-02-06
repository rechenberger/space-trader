/* tslint:disable */
/* eslint-disable */
/**
 * SpaceTraders API
 * SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.  The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.  ```json http {   \"method\": \"GET\",   \"url\": \"https://api.spacetraders.io/v2\", } ```  Unlike a traditional game, SpaceTraders does not have a first-party client or app to play the game. Instead, you can use the API to build your own client, write a script to automate your ships, or try an app built by the community.  We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.   
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: joel@spacetraders.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface GetStatus200ResponseStats
 */
export interface GetStatus200ResponseStats {
    /**
     * Number of registered agents in the game.
     * @type {number}
     * @memberof GetStatus200ResponseStats
     */
    agents: number;
    /**
     * Total number of ships in the game.
     * @type {number}
     * @memberof GetStatus200ResponseStats
     */
    ships: number;
    /**
     * Total number of systems in the game.
     * @type {number}
     * @memberof GetStatus200ResponseStats
     */
    systems: number;
    /**
     * Total number of waypoints in the game.
     * @type {number}
     * @memberof GetStatus200ResponseStats
     */
    waypoints: number;
}

/**
 * Check if a given object implements the GetStatus200ResponseStats interface.
 */
export function instanceOfGetStatus200ResponseStats(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "agents" in value;
    isInstance = isInstance && "ships" in value;
    isInstance = isInstance && "systems" in value;
    isInstance = isInstance && "waypoints" in value;

    return isInstance;
}

export function GetStatus200ResponseStatsFromJSON(json: any): GetStatus200ResponseStats {
    return GetStatus200ResponseStatsFromJSONTyped(json, false);
}

export function GetStatus200ResponseStatsFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetStatus200ResponseStats {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'agents': json['agents'],
        'ships': json['ships'],
        'systems': json['systems'],
        'waypoints': json['waypoints'],
    };
}

export function GetStatus200ResponseStatsToJSON(value?: GetStatus200ResponseStats | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'agents': value.agents,
        'ships': value.ships,
        'systems': value.systems,
        'waypoints': value.waypoints,
    };
}

