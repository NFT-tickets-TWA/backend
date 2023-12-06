import {Injectable} from '@nestjs/common';
import {Person, Prisma} from '@prisma/client';
import {PrismaService} from './prisma.service';
import {PersonDTO, ParticipantListDTO} from "../stractures/stractures";
import {toNumber} from "ethers";

@Injectable()
export class ParticipantListService {
    constructor(private prisma: PrismaService) {
    }

    async register(person_id: number, event_id: number): Promise<ParticipantListDTO> {
        return this.prisma.participantList.create({
            data: {
                personID: person_id,
                eventID: event_id
            }
        });
    }

    async changeStatus(person_id: number, event_id: number,newStatus:string){
        return this.prisma.participantList.update({
            where: {
                personID_eventID:
                    {
                        personID: person_id,
                        eventID: event_id
                    }
            },
            data: {
                status: {
                    connect: {
                        status: newStatus
                    }
                }
            }
        })
    }

    async getApprovedPersonsByEvent(event_id: number) {
        return this.prisma.participantList.findMany(
            {
                where: {
                    eventID: toNumber(event_id),
                    status: {
                        status: "APPROVED"
                    }
                },
                select:{
                    personID:true,
                    person:{
                        select: {
                            walletAddress: true
                        }
                    },
                    eventID:true,
                    event:{
                        select:{
                            collectionAddr:true,
                            isSBT:true
                        }
                    }
                }
            }
        )
    }
}
