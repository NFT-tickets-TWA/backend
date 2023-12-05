import {ApiProperty, ApiResponse} from "@nestjs/swagger";
import {EventStatus, EventType, Person, ParticipantList} from "@prisma/client";
import {applyDecorators} from "@nestjs/common";


export class PersonDTO {
    @ApiProperty()
    walletAddress: string;
    @ApiProperty({description: "telegram id"})
    tgId: string;

}

class UserRoleDTO {
    id?: number;
    person: PersonDTO;
    role: RoleDTO;

    constructor(data: UserRoleDTO) {
        Object.assign(this, data);
    }
}


export class ParticipantListDTO {
    id?: number
    @ApiProperty()
    personID: number
    @ApiProperty()
    eventID: number
    @ApiProperty()
    statusID: number;
}

class ParticipantStatusDTO {
    id?: number;
    status: string;
    participantLists: ParticipantList[];

    constructor(data: ParticipantStatusDTO) {
        Object.assign(this, data);
    }
}

class RoleDTO {
    id?: number;
    name: string;

    constructor(data: RoleDTO) {
        Object.assign(this, data);
    }
}

export class EventTypeDTO {
    id?: number;
    @ApiProperty()
    type: string;
}

export class EventStatusDTO {
    id?: number;
    @ApiProperty()
    status: string;


}

export class LocationDTO {
    id?: number;
    @ApiProperty()
    address?: string;
    @ApiProperty()
    room?: string;
    @ApiProperty()
    isOffline: boolean;
    @ApiProperty()
    link?: string;
}


export class ContractEvent {
    name: string;
    nftPattern: string;
    symbol: string;
    countOfRewardTokens: number;
    SBTState: boolean;

    constructor(name: string, url: string, symbol: string, countOfTokens: number, SBTState: boolean) {
        this.name = name;
        this.nftPattern = url;
        this.symbol = symbol;
        this.countOfRewardTokens = countOfTokens;
        this.SBTState = SBTState;
    }
}


