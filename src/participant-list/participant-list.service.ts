import {Injectable} from '@nestjs/common';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {PrismaService} from "../prisma/prisma.service";
import {EventService} from "../event/event.service";
import {Prisma} from "@prisma/client";


@Injectable()
export class ParticipantListService {
    constructor(private prisma: PrismaService, private eventService: EventService) {
    }


    async create(createParticipantListInput: CreateParticipantListInput,  selectArgs: { select: Prisma.ParticipantListSelect }) {
        const data = await this.prisma.participantList.create({
            data: createParticipantListInput,
            select: selectArgs.select
        });
        await this.eventService.addParticipant(createParticipantListInput.eventID);
        return data;
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

    approve(personID: number, eventID: number) {
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

    sendNft(personID: number, eventID: number) {
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
