import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {PrismaService} from "../prisma/prisma.service";
import {EventService} from "../event/event.service";
import {Prisma} from "@prisma/client";


@Injectable()
export class ParticipantListService {
    constructor(private prisma: PrismaService, @Inject(forwardRef(() => EventService)) private eventService: EventService) {
    }


    async create(createParticipantListInput: CreateParticipantListInput,  selectArgs: { select: Prisma.ParticipantListSelect }) {
       console.log("smth")
        const data = await this.prisma.participantList.create({
            data: createParticipantListInput,
            select: selectArgs.select
        });
        console.log(data)
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
        console.log("smth")
        this.prisma.participantList.findUnique(
            {
                where: {
                    personID_eventID: {
                        personID: personID,
                        eventID: eventID
                    },
                    status: "REGISTERED"
                }
            }
        ).then((res)=>{
            console.log(res)
        })
        return this.prisma.participantList.update({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                },
                status: "REGISTERED"
            },
            data: {
                status:"APPROVED"
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
    get(personID:number,eventID: number) {
        return this.prisma.participantList.findUnique({
            where: {
                personID_eventID: {
                    personID: personID,
                    eventID: eventID
                }
            },
            select: {
                personID: true,
                status:true,
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
        console.log("update nft status on received nft: person "+personID+" event "+eventID)
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
