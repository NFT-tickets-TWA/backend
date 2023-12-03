import {applyDecorators} from "@nestjs/common";
import {ApiResponse} from "@nestjs/swagger";

export class CustomResponse {
    status: number;
    message: string;
    hash: string

    constructor(status, message, hash?) {
        this.status = status;
        this.message = message;
        this.hash = hash;
    }
}
export function Response400() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            schema: {example: {message: 'message'}},
            description: "returns error message if  PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError"
        })
    );
}

export function Response500() {
    return applyDecorators(
        ApiResponse({
            status: 500,
            schema: {example: {message: 'message'}},
            description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
        })
    );
}
