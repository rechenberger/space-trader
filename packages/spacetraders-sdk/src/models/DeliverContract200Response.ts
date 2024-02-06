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
import type { DeliverContract200ResponseData } from './DeliverContract200ResponseData';
import {
    DeliverContract200ResponseDataFromJSON,
    DeliverContract200ResponseDataFromJSONTyped,
    DeliverContract200ResponseDataToJSON,
} from './DeliverContract200ResponseData';

/**
 * 
 * @export
 * @interface DeliverContract200Response
 */
export interface DeliverContract200Response {
    /**
     * 
     * @type {DeliverContract200ResponseData}
     * @memberof DeliverContract200Response
     */
    data: DeliverContract200ResponseData;
}

/**
 * Check if a given object implements the DeliverContract200Response interface.
 */
export function instanceOfDeliverContract200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function DeliverContract200ResponseFromJSON(json: any): DeliverContract200Response {
    return DeliverContract200ResponseFromJSONTyped(json, false);
}

export function DeliverContract200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DeliverContract200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': DeliverContract200ResponseDataFromJSON(json['data']),
    };
}

export function DeliverContract200ResponseToJSON(value?: DeliverContract200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': DeliverContract200ResponseDataToJSON(value.data),
    };
}

