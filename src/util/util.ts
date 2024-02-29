import {applyDecorators, createParamDecorator, ExecutionContext, Logger} from "@nestjs/common";
import {ApiResponse} from "@nestjs/swagger";
import {Prisma} from "@prisma/client";
import {Response} from "express";
import {GqlExecutionContext} from "@nestjs/graphql";
import {GraphQLResolveInfo} from "graphql/type";
import {parseResolveInfo, ResolveTree} from 'graphql-parse-resolve-info';
const logger = new Logger("Util")
export class CustomResponse {
    status: number;
    message: string;
    address: string

    constructor(status:number, message:string, address?:string) {
        this.status = status;
        this.message = message;
        this.address = address;
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


export type PrismaSelect = {
    select: {
        [key: string]: true | PrismaSelect;
    };
};



export const Relations = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const info = GqlExecutionContext.create(ctx).getInfo<GraphQLResolveInfo>();
        const ast = parseResolveInfo(info);
        return astToPrisma(Object.values((ast as ResolveTree).fieldsByTypeName)[0]);
    },
);

export const astToPrisma = (ast: {
    [str: string]: ResolveTree;
}): PrismaSelect => {
    return {
        select: Object.fromEntries(
            Object.values(ast).map(field => [
                field.name,
                Object.keys(field.fieldsByTypeName).length === 0
                    ? true
                    : astToPrisma(Object.values(field.fieldsByTypeName)[0]),
            ]),
        ),
    };
};

export function handlePrismaError(error: any, res: Response): Response {
    if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError || error instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: error.message});
}