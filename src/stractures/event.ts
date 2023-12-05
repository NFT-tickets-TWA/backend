import {ApiProperty} from "@nestjs/swagger";

export class EventDTOResponse {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    isSBT: boolean;
    @ApiProperty({
        uniqueItems: true
    }) nftIpfsUrl ?: string | null;
    @ApiProperty()
    collectionAddr: string;
    @ApiProperty({
        required: false
    }) urlCover ?: string | null;
    @ApiProperty({
        required: false
    }) description ?: string | null;
    @ApiProperty()
    creatorID: number;
    @ApiProperty({
        required: false
    }) started_at ?: Date;
    @ApiProperty({
        required: false
    }) finished_at ?: Date;
    @ApiProperty({
        required: false
    }) locationID ?: number | null;
    @ApiProperty()
    registeredParticipants: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty()
    typeId: number;
    @ApiProperty()
    statusId: number;
    approveLink:string;
}

export class EventDTORequest {
    @ApiProperty()
    name: string;
    @ApiProperty({
        required: false, description: "ask Yaroslav, don't care now"
    }) urlCover ?: string | null;
    @ApiProperty({
        required: false
    }) description ?: string | null;
    @ApiProperty({
        description: "telegram id of creator"
    }) creatorTgId: string;
    @ApiProperty()
    isSBT: boolean;
    @ApiProperty({
        required: false
    }) started_at ?: Date;
    @ApiProperty({
        required: false
    }) finished_at ?: Date;
    @ApiProperty({
        required: false
    }) locationID ?: number | null;
    @ApiProperty({
        uniqueItems: true, description: "nft ipfs url"
    }) nftIpfsUrl: string;
    registeredParticipants ?: number;
    @ApiProperty()
    countOfRewardTokens: number;
    @ApiProperty({
        required: false, default: 1, description: "type of event, default not stated"
    }) typeId ?: number;
    @ApiProperty({
        required: false, default: 1, description: "status of event, default not registered"
    }) statusId ?: number;
    approveLink:string;
}

export class EventDTO {
    name: string;
    urlCover ?: string | null;
    description ?: string | null;
    creatorID: number;
    isSBT: boolean;
    started_at ?: Date;
    finished_at ?: Date;
    locationID ?: number | null;
    nftIpfsUrl: string;
    registeredParticipants ?: number;
    countOfRewardTokens: number;
    typeId ?: number;
    statusId ?: number;
    approveLink:string;
}

export function convertEventDTORequestToEventDTO(event: EventDTORequest, id: number): EventDTO {
    let newEvent = new EventDTO();
    newEvent.name = event.name;
    newEvent.urlCover = event.urlCover;
    newEvent.description = event.description;
    newEvent.creatorID = id;
    newEvent.isSBT = event.isSBT;
    newEvent.started_at = event.started_at;
    newEvent.finished_at = event.finished_at;
    newEvent.locationID = event.locationID;
    newEvent.nftIpfsUrl = event.nftIpfsUrl;
    newEvent.registeredParticipants = event.registeredParticipants;
    newEvent.countOfRewardTokens = event.countOfRewardTokens;
    newEvent.typeId = event.typeId;
    newEvent.statusId = event.statusId;
    return newEvent;
}
