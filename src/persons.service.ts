import { Injectable } from '@nestjs/common';
import { Person, Role } from '@prisma/client';
import {PersonsRepository} from "./persons.repository";


@Injectable()
export class PersonsService {
    constructor(private repository: PersonsRepository) {}

    async createTweet(params: { walletAddress: Person[`walletAddress`];tgId: Person[`tgId`]; roleID: Role[`id`] }) {
        const { walletAddress, tgId, roleID } = params;

        // call repository layer
        const person = await this.repository.createPerson({
            data: {
                walletAddress,
                tgId,
                role:{
                    connect:{
                        id:roleID
                    }
                }
            },
        });

        return person;
    }

    async getPerson() {
        const persons = await this.repository.getPersons({});
        return persons;
    }
}

