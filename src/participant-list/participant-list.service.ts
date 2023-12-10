import {Injectable} from '@nestjs/common';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {PrismaService} from "../prisma/prisma.service";


@Injectable()
export class ParticipantListService {
    constructor(private prisma: PrismaService) {
    }


    create(createParticipantListInput: CreateParticipantListInput) {
        // todo:count of pert
        return this.prisma.participantList.create({
            data: createParticipantListInput
        })
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
                status: {
                    select: {
                        status: true
                    }
                }
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
                status: {
                    status: "REGISTERED"
                }
            },
            data: {
                status: {
                    connect: {
                        status: "APPROVE"
                    }
                }
            }
        })
    }

    getApprovedPersons(eventID: number) {
        return this.prisma.participantList.findMany({
            where: {
                eventID: eventID,
                status: {
                    status: "APPROVED"
                }
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
                        collectionAddr: true,
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
                status: {
                    connect: {
                        status: "RECEIVED_NFT"
                    }
                }
            }
        })
    }

}
