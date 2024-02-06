import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {PrismaService} from "../prisma/prisma.service";
import {EventService} from "../event/event.service";
import {Prisma} from "@prisma/client";
import {Args} from "@nestjs/graphql";


@Injectable()
export class ParticipantListService {
    private readonly logger = new Logger(ParticipantListService.name)
    constructor(private prisma: PrismaService, @Inject(forwardRef(() => EventService)) private eventService: EventService) {
    }


    async create(personID: number, eventID: number, selectArgs: { select: Prisma.ParticipantListSelect }) {
        this.prisma.participantList.create({
            data: {personID, eventID},
            select: selectArgs.select
        }).then((data)=>{
            return this.eventService.incrementParticipantCount(eventID).then(()=>{
                return data;
            });
        }).catch((e)=>{
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    this.logger.warn(e)
                    throw "It is likely that the person is already registered"
                }
            }
            throw e
        });

    }


    getCurrentStatus(personID: number, eventID: number) {
        return this.prisma.participantList.findUnique({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                }
            },
            select: {
                status: true
            }
        });
    }

    approveParticipant(personID: number, eventID: number) {
        return this.prisma.participantList.update({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                },
                status: "REGISTERED"
            },
            data: {
                status: "APPROVED"
            }
        })
    }

    getApprovedPersons(eventID: number) {
        return this.prisma.participantList.findMany({
            where: {
                eventID: eventID,
                status: "APPROVED"

            },
            select: {
                personID: true,
                person: {
                    select: {
                        walletAddress: true
                    }
                },
                eventID: true,
                event: {
                    select: {
                        contractAddress: true,
                        isSBT: true
                    }
                }
            }

        })
    }

    getParticipant(personID: number, eventID: number) {
        return this.prisma.participantList.findUnique({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                }
            },
            select: {
                personID: true,
                status: true,
                person: {
                    select: {
                        walletAddress: true
                    }
                },
                eventID: true,
                event: {
                    select: {
                        contractAddress: true,
                        isSBT: true
                    }
                }
            }

        })
    }

    sendNft(personID: number, eventID: number) {
        this.logger.log("update nft status on received nft: person " + personID + " event " + eventID)
        return this.prisma.participantList.update({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                }
            },
            data: {
                status: "RECEIVED_NFT"
            }
        })
    }

}
