import {ApiProperty} from "@nestjs/swagger";
import {EventStatus, EventType, Person, WhiteList} from "@prisma/client";

class PersonDTO {
    id?: number;
    walletAddress: string;
    name: string;
    roles: UserRoleDTO[];
    WhiteList: WhiteListDTO[];
    events: EventDTO[];

    constructor(data: PersonDTO) {
        Object.assign(this, data);
    }
}
class UserRoleDTO {
    id?: number;
    person: PersonDTO;
    role: RoleDTO;

    constructor(data: UserRoleDTO) {
        Object.assign(this, data);
    }
}
class NftListDTO {
    id?: number;
    whiteList: WhiteListDTO;
    status: NftStatusDTO;

    constructor(data: NftListDTO) {
        Object.assign(this, data);
    }
}
class WhiteListDTO {
    id?: number;
    person: PersonDTO;
    event: EventDTO;
    nftList?: NftListDTO;

    constructor(data: WhiteListDTO) {
        Object.assign(this, data);
    }
}
export class EventDTOForPrint {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty({required:false})
    urlCover?: string | null;
    @ApiProperty({required:false})
    description?: string | null;
    @ApiProperty()
    creatorID: number;
    @ApiProperty({required:false})
    started_at?: Date;
    @ApiProperty({required:false})
    finished_at?: Date;
    @ApiProperty({required:false})
    locationID?: number | null;
    @ApiProperty({uniqueItems:true})
    nftPattern?: string | null;
    @ApiProperty()
    collectionAddr: string ;
    @ApiProperty()
    registeredParticipants: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty()
    typeId: number;
    @ApiProperty()
    statusId: number;
    @ApiProperty()
    symbol: string;
}

export class EventDTO {
    @ApiProperty()
    name: string;
    @ApiProperty({required:false})
    urlCover?: string | null;
    @ApiProperty({required:false})
    description?: string | null;
    @ApiProperty()
    creatorID: number;
    @ApiProperty({required:false})
    started_at?: Date;
    @ApiProperty({required:false})
    finished_at?: Date;
    @ApiProperty({required:false})
    locationID?: number | null;
    @ApiProperty({uniqueItems:true})
    nftPattern: string;
    @ApiProperty({required:false, default:0})
    registeredParticipants?: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty({required:false, default:1})
    typeId?: number;
    @ApiProperty({required:false, default:1})
    statusId?: number;
    @ApiProperty()
    symbol: string;
}
class NftStatusDTO {
    id?: number;
    status: string;
    nftLists: NftListDTO[];

    constructor(data: NftStatusDTO) {
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

class EventTypeDTO {
    id?: number;
    type: string;
    events: EventDTO[];

    constructor(data: EventTypeDTO) {
        Object.assign(this, data);
    }
}
class EventStatusDTO {
    id?: number;
    status: string;
    events: EventDTO[];

    constructor(data: EventStatusDTO) {
        Object.assign(this, data);
    }
}
class LocationDTO {
    id?: number;
    address?: string;
    room?: string;
    isOffline: boolean;
    link?: string;
    events: EventDTO[];

    constructor(data: LocationDTO) {
        Object.assign(this, data);
    }
}


export class ContractEvent {
    name: string;
    url: string;
    symbol: string;
    countOfTokens: number;

    constructor(name, url, symbol, countOfTokens) {
        this.name = name;
        this.url = url;
        this.symbol = symbol;
        this.countOfTokens = countOfTokens;
    }
}

export class Response {
    status: number;
    message: string;
    hash: string

    constructor(status, message, hash?) {
        this.status = status;
        this.message = message;
        this.hash = hash;
    }
}
