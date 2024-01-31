import * as process from "process";

import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
const crypto = require('crypto')
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log(context.switchToHttp().getRequest())
        for (var i = 0; i < context.getArgs()[2].req.rawHeaders.length; i++) {
            if (context.getArgs()[2].req.rawHeaders[i] == 'telegram-data') {

                return checkAuthorization(context.getArgs()[2].req.rawHeaders[i + 1]);
            }
        }

        return false;
    }
}


function parseAuthString(iniData) {

    const searchParams = new URLSearchParams(iniData);

    const hash = searchParams.get('hash');
    searchParams.delete('hash');

    const restKeys = Array.from(searchParams.entries());
    restKeys.sort(([aKey, aValue], [bKey, bValue]) => aKey.localeCompare(bKey));

    const dataCheckString = restKeys.map(([n, v]) => `${n}=${v}`).join('\n');

    return {
        dataCheckString,
        hash
    };
}

function encodeHmac(message, key, repr=undefined) {
    return crypto.createHmac('sha256', key).update(message).digest(repr);
}

function checkAuthorization(iniData){

    console.log(iniData)
    const authTelegramData = parseAuthString(iniData);

    console.log(authTelegramData.dataCheckString)
    const secretKey = encodeHmac(
        process.env.TELEGRAM_BOT_TOKEN,
        process.env.WEB_APP_DATA_CONST,
    );


    const validationKey = encodeHmac(
        authTelegramData.dataCheckString,
        secretKey,
        'hex',
    );
    console.log(validationKey)
    console.log(authTelegramData.hash)

    if (validationKey === authTelegramData.hash) {
        return true;
    }

    return null;
}