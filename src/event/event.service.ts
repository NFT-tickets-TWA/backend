import {forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {CreateEventInput} from './dto/create-event.input';
import {PrismaService} from "../prisma/prisma.service";
import {ContractEvent, createInternalEvent, mintNft} from "../contract/contract";

import {EventStatus, ParticipantList, Prisma} from '@prisma/client';
import {FindUniqueEventOrThrowArgs} from "./dto/find-unique-event-or-throw.args";
import {FindManyEventArgs} from "./dto/find-many-event.args";
import {ParticipantListService} from "../participant-list/participant-list.service";


@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name)

    constructor(private prisma: PrismaService, @Inject(forwardRef(() => ParticipantListService)) private participantListService: ParticipantListService) {
    }

    async createEventInDB(createEventInput: CreateEventInput, tgID: string) {
        const person = await this.prisma.person.findUnique({
            where: {
                tgID: tgID
            }
        });
        if (person == null) {
            this.logger.warn("create event: there is no person with this tgID: " + tgID)
            throw new Error("there is no person with this tgID")
        }
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
        this.logger.log("create event starts")
        const event = await this.createEventInDB(createEventInput, tgID);
        const contractResponse = await createInternalEvent(new ContractEvent(createEventInput.name, createEventInput.nftIpfsUrl, this.generateSymbol(), createEventInput.countOfRewardTokens, createEventInput.isSBT));
        if (contractResponse.status == 200) {
            return this.addContractAddress(event.id, contractResponse.address, args).then((newEvent) => {
                    if (createEventInput.registrationFinishedAt != undefined) {
                        this.registrationClosed(event.id, createEventInput.registrationFinishedAt)
                    } else {
                        this.registrationClosed(event.id, createEventInput.finishedAt)
                    }
                    return newEvent;
                }
            ).catch((contractError) => {
                this.logger.warn(contractError)
                this.logger.warn("try to delete event from db")
                this.deleteEvent(event.id).then(() => {
                        throw new HttpException("impossible to update contract address", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                ).catch((deleteError) => {
                    this.logger.warn(deleteError)
                    throw new HttpException("impossible to update contract address, after that failed to delete crested event", HttpStatus.INTERNAL_SERVER_ERROR);
                });
            });

        } else {
            this.logger.warn("try to delete event from db")
            this.deleteEvent(event.id).then(() => {
                    throw new HttpException(contractResponse.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            ).catch((deleteError) => {
                this.logger.warn(deleteError)
                throw new HttpException(contractResponse.message, HttpStatus.INTERNAL_SERVER_ERROR);
            });
        }
    }


    findOne(whereArgs: FindUniqueEventOrThrowArgs, selectArgs: { select: Prisma.EventSelect }) {
        this.logger.log("find one starts, where: " + whereArgs)
        return this.prisma.event.findUnique({
            where: whereArgs.where, select: selectArgs.select
        })
    }

    findMany(whereArgs: FindManyEventArgs, selectArgs: { select: Prisma.EventSelect }) {
        this.logger.log("find many starts, where: " + whereArgs)
        return this.prisma.event.findMany({
            where: whereArgs.where, select: selectArgs.select
        })
    }

    async mintNftAll(eventID: number): Promise<ParticipantList[]> {
        this.logger.log("mint nft all starts")
        return this.participantListService.getApprovedPersons(eventID).then((participants) => {
            const promises: Promise<ParticipantList>[] = [];
            participants.forEach((participant) => {
                promises.push(this.mint(participant.personID, participant.eventID, participant.person.walletAddress, participant.event.contractAddress, participant.event.isSBT));
            })
            return Promise.all(promises);
        })
    }

    async mintOne(personID: number, eventID: number): Promise<ParticipantList> {
        this.logger.log("mint nft starts, person ", personID, " event ", eventID)
        return this.participantListService.getParticipant(personID, eventID).then(
            (participant) => {
                return this.mint(participant.personID, participant.eventID, participant.person.walletAddress, participant.event.contractAddress, participant.event.isSBT)
            }
        )
    }

    async mint(person_id: number, event_id: number, walletAddress: string, contractAddress: string, isSbt: boolean): Promise<ParticipantList> {
        return mintNft(walletAddress, contractAddress, isSbt).then(
            (data) => {
                if (data.status == 200) {
                    return this.participantListService.sendNft(person_id, event_id);
                } else {
                    this.logger.warn("mint nft error " + data.message, " person ", person_id, " event ", event_id)
                    throw new Error(data.message)
                }
            }
        )
    }

    incrementParticipantCount(eventID: number) {
        return this.prisma.event.update({
            where: {
                id: eventID
            },
            data: {
                registeredParticipants: {
                    increment: 1
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

    updateStatus(eventID: number, newStatus: EventStatus, args?: { select: Prisma.EventSelect }) {
        return this.prisma.event.update({
                where: {
                    id: eventID
                },
                data: {
                    status: newStatus
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
                }
            }
        ).then(() => {
            return this.prisma.event.findUnique({
                where: {
                    id: id
                },
                select: args.select

            })
        })

    }

    deleteEvent(id: number) {
        return this.prisma.event.delete({
            where: {
                id: id
            }
        })
    }

    registrationClosed(id: number, dataToCloseRegistration: Date) {
        setTimeout(
            () => {
                this.prisma.event.update({
                        where: {
                            id: id
                        },
                        data: {
                            status: EventStatus.REGISTRATION_CLOSED
                        }
                    }
                ).then(()=>  this.logger.log("registration closed on event with id"+id)).catch(
                    (e)=>{
                        this.logger.warn("unable to close registration"+e)
                    }
                )
            }
            ,
            new Date().getMilliseconds() - dataToCloseRegistration.getMilliseconds())

    }
}
