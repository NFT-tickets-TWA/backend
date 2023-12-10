import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateEventInput} from './dto/create-event.input';
import {PrismaService} from "../prisma/prisma.service";
import {createInternalEvent} from "../contract/contract";
import {ContractEvent} from "../rest/util/responses";
import {Prisma} from '@prisma/client';


@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {
    }

    async create(createEventInput: CreateEventInput, tgID: string) {
        const person = await this.prisma.person.findUnique({
            where: {
                tgId: tgID
            }
        });
        if(person==null){
            throw new Error("there is no person with this tgID")
        }
        console.log(person)
        return this.prisma.event.create({
            data: {
                ...createEventInput,
                creatorID: person.id
            }
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

    async createEvent(createEventInput: CreateEventInput, tgID: string, args: { select: Prisma.EventSelect }) {
        console.log("ss")
        const event = await this.create(createEventInput, tgID);
        const contractResponse = await createInternalEvent(new ContractEvent(createEventInput.name, createEventInput.nftIpfsUrl, this.generateSymbol(), createEventInput.countOfRewardTokens, createEventInput.isSBT));
        if (contractResponse.status == 200) {
            return this.addContractAddress(event.id, contractResponse.address, args).then(() => {
                    return event;
                }
            ).catch((error) => {
                console.log(error);
                this.deleteEvent(event.id).then(() => {
                        throw new HttpException("impossible to update contract address", HttpStatus.INTERNAL_SERVER_ERROR);

                    }
                ).catch((error_1) => {
                    console.log(error_1);
                    throw new HttpException("impossible to update contract address, after that failed to delete crested event", HttpStatus.INTERNAL_SERVER_ERROR);
                });
            });

        } else {
            this.deleteEvent(event.id).then(() => {
                    throw new HttpException(contractResponse.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            ).catch((error_2) => {
                console.log(error_2);
                throw new HttpException(contractResponse.message, HttpStatus.INTERNAL_SERVER_ERROR);
            });
        }
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
    addParticipant(event_id:number){
        return this.prisma.event.update({
            where:{
                id:event_id
            },
            data:{
                registeredParticipants:{
                    increment:1
                }
            }
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

    addContractAddress(id: number, contractAddress: string, args: { select: Prisma.EventSelect }) {
        return this.prisma.event.update({
                where: {
                    id: id
                },
                data: {
                    contractAddress: contractAddress
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
