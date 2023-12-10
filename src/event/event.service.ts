import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateEventInput} from './dto/create-event.input';
import {PrismaService} from "../prisma/prisma.service";
import {createInternalEvent} from "../contract/contract";
import {ContractEvent} from "../stractures/stractures";
import {readJsonFromDiskSync} from "tsconfig-paths/lib/filesystem";
import {Event} from "./entities/event.entity";
import {Prisma} from '@prisma/client';
import {DefaultArgs} from '@prisma/client/runtime/library';
import {PrismaSelect} from "../rest/uril/responses";


@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {
    }

    create(createEventInput: CreateEventInput, tgID: string) {
       return  this.prisma.person.findUnique({
            where: {
                tgId: tgID
            }
        }).then((person) => {

            return this.prisma.event.create({
                data: {
                    ...createEventInput,
                    creatorID: person.id
                }
            })
        });

    }

    generateSymbol(): string {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    }

    createEvent(createEventInput: CreateEventInput, tgID:string, args: { select: Prisma.EventSelect }) {

        return this.create(createEventInput, tgID).then((event) => {
            return createInternalEvent(new ContractEvent(createEventInput.name, createEventInput.nftIpfsUrl, this.generateSymbol(), createEventInput.countOfRewardTokens, createEventInput.isSBT)).then((result) => {
                    if (result.status == 200) {
                        return this.addCollectionAddress(event.id, result.hash, args).then(() => {
                              return event;
                            }
                        ).catch((error) => {
                            console.log(error)
                            this.deleteEvent(event.id).then(() => {
                                    throw new HttpException("impossible to update collection address", HttpStatus.INTERNAL_SERVER_ERROR)

                                }
                            ).catch((error) => {
                                console.log(error)
                                throw new HttpException("impossible to update collection address, after that failed to delete crested event", HttpStatus.INTERNAL_SERVER_ERROR)
                            })
                        })

                    } else {
                        this.deleteEvent(event.id).then(() => {
                                throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR)
                            }
                        ).catch((error) => {
                            console.log(error)
                            throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR)
                        })
                    }
                }
            )
        })
    }


    findAll(args: { select: Prisma.EventSelect }) {
        return this.prisma.event.findMany({
            select: args.select
        });
    }

    findOneByID(id: number, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.findUnique({
            where: {
                id: id
            }, select: args.select
        })
    }

    findManyByTG(tgID: string, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.findMany({
            where: {
                creator: {
                    tgId: tgID
                }
            }, select: args.select
        })
    }

    findOneByLink(link: string, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.findUnique({
            where: {
                approveLink: link
            }, select: args.select
        })
    }

    findManyByName(name: string, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.findMany({
            where: {
                name: name
            }, select: args.select
        })
    }

    addApproveLink(eventID: number, approveLink: string, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.update({
                where: {
                    id: eventID
                },
                data: {
                    approveLink: approveLink
                }, select: args.select
            }
        );
    }

    addCollectionAddress(id: number, contractAddress: string, args: { select: Prisma.EventSelect }) {

        return this.prisma.event.update({
                where: {
                    id: id
                },
                data: {
                    collectionAddr: contractAddress
                },
                select: args.select
            }
        )
    }

    deleteEvent(id: number) {
        return this.prisma.event.delete({
            where: {
                id: id
            }
        })
    }
}
