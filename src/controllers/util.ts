import {Response} from "express";
import {Prisma} from '@prisma/client';


export function handlePrismaError(error: any, res: Response): Response<any, Record<string, any>> {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError || error instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: error.message});
}



