import * as process from "process";

import {Injectable, CanActivate, ExecutionContext, Logger} from '@nestjs/common';
import {Observable} from 'rxjs';
import { webcrypto } from 'crypto';

const logger = new Logger("Auth")
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        for (let i = 0; i < context.getArgs()[2].req.rawHeaders.length; i++) {
            if (context.getArgs()[2].req.rawHeaders[i] == 'telegram-data') {
                const data = Object.fromEntries(new URLSearchParams(context.getArgs()[2].req.rawHeaders[i + 1]));
                return isHashValid(data, process.env.TELEGRAM_BOT_TOKEN);
            }
        }
        return false;
    }
}

async function isHashValid(data: Record<string, string>, botToken: string) {
    const encoder = new TextEncoder();

    const checkString = Object.keys(data)
        .filter((key) => key !== 'hash')
        .map((key) => `${key}=${data[key]}`)
        .sort()
        .join('\n');

    const secretKey = await webcrypto.subtle.importKey(
        'raw',
        encoder.encode('WebAppData'),
        { name: 'HMAC', hash: 'SHA-256' },
        true,
        ['sign']
    );

    const secret = await webcrypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));

    const signatureKey = await webcrypto.subtle.importKey(
        'raw',
        secret,
        { name: 'HMAC', hash: 'SHA-256' },
        true,
        ['sign']
    );

    const signature = await webcrypto.subtle.sign('HMAC', signatureKey, encoder.encode(checkString));

    const hex = Buffer.from(signature).toString('hex');
    logger.log("expected hash: ",data.hash)
    logger.log("calculated hash: ",hex)
    return data.hash === hex;
}