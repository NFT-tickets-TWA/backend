import {ApiProperty} from "@nestjs/swagger";
import {EventStatus, EventType, Person, WhiteList} from "@prisma/client";

export class PersonDTO {
    @ApiProperty()
    walletAddress: string;
    @ApiProperty({description:"telegram id"})
    tgId: number;

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
export class WhiteListDTO {
    id?: number
    @ApiProperty()
    personID: number
    @ApiProperty()
    eventID: number
}
export class EventDTOResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    isSBT: boolean;
    @ApiProperty({uniqueItems:true})
    nftIpfsUrl?: string | null;
    @ApiProperty()
    collectionAddr: string ;
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
    @ApiProperty()
    registeredParticipants: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty()
    typeId: number;
    @ApiProperty()
    statusId: number;
}
export class EventDTORequest {
    @ApiProperty()
    name: string;
    @ApiProperty({required:false, description:"ask Yaroslav, don't care now"})
    urlCover?: string | null;
    @ApiProperty({required:false})
    description?: string | null;
    @ApiProperty({description:"telegram id of creator"})
    creatorTgId: number;
    @ApiProperty()
    isSBT: boolean;
    @ApiProperty({required:false})
    started_at?: Date;
    @ApiProperty({required:false})
    finished_at?: Date;
    @ApiProperty({required:false})
    locationID?: number | null;
    @ApiProperty({uniqueItems:true, description:"nft ipfs url"})
    nftIPFSurl: string;
    registeredParticipants?: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty({required:false, default:1, description:"type of event, default not stated"})
    typeId?: number;
    @ApiProperty({required:false, default:1, description:"status of event, default not registered"})
    statusId?: number;
}
export class EventDTO {
    name: string;
    urlCover?: string | null;
    description?: string | null;
    creatorID: number;
    isSBT: boolean;
    started_at?: Date;
    finished_at?: Date;
    locationID?: number | null;
    nftIPFSurl: string;
    registeredParticipants?: number;
    countOfRewardTokens: number;
    typeId?: number;
    statusId?: number;
}
export function convertEventDTORequestToEventDTO(event: EventDTORequest, id:number):EventDTO{
    let newEvent = new EventDTO();
    newEvent.name=event.name;
    newEvent.urlCover=event.urlCover;
    newEvent.description=event.description;
    newEvent.creatorID=id;
    newEvent.isSBT=event.isSBT;
    newEvent.started_at=event.started_at;
    newEvent.finished_at=event.finished_at;
    newEvent.locationID=event.locationID;
    newEvent.nftIPFSurl=event.nftIPFSurl;
    newEvent.registeredParticipants=event.registeredParticipants;
    newEvent.countOfRewardTokens=event.countOfRewardTokens;
    newEvent.typeId=event.typeId;
    newEvent.statusId=event.statusId;
    return newEvent;
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
        this.SBTState=SBTState;
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
