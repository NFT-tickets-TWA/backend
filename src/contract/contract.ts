import * as process from "process";

import {CustomResponse} from "../util/util";
import {ethers} from "ethers";
import fs from "fs";

import {Logger} from "@nestjs/common";

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const providerURL = process.env.PROVIDER_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privateKey, provider);
const parentABI: string = fs.readFileSync(process.env.PARENT_ABI_PATH).toString();
const childABI: string = fs.readFileSync(process.env.CHILD_ABI_PATH).toString();
const contract = new ethers.Contract(contractAddress, JSON.parse(parentABI), wallet);
const logger = new Logger("Contract");
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

async function listenForEvent(): Promise<string> {
    return new Promise((resolve, reject) => {
        contract.on("newEvent", (id, name, addr) => {
            resolve(addr);
        })
        contract.on('error', (error) => {
            reject(error);
        });
    });
}

export async function createInternalEvent(event: ContractEvent) {
    logger.log("create internal event:start");
    if (event.name == undefined || event.nftPattern == undefined || event.symbol == undefined || event.countOfRewardTokens == undefined || event.SBTState == undefined) {
        logger.warn("create internal event:required data is missing")
        return new CustomResponse(400, "Required data is missing");
    }
    try {
        const createReceipt = await contract.createInternalEvent(
            event.name,
            event.symbol,
            event.nftPattern,
            event.countOfRewardTokens,
            process.env.TOKEN_ADDRESS,
            event.SBTState
        );
        logger.log("create internal event:request to solidity sent");
        const l = listenForEvent()
        await createReceipt.wait();
        logger.log("create internal event:response from solidity received");
        return l.then((addr) => {
            logger.log("create internal event: received addr " + addr)
            return new CustomResponse(200, "created", addr);
        }).catch((e) => {
            logger.warn("create internal event: failed to create event: " + e)
            return new CustomResponse(520, "Failed to created event");
        })
    } catch (e) {
        logger.warn("create internal event: failed to create event: " + e)
        return new CustomResponse(520, "Failed to created event");
    }
}

export async function mintNft(walletAddress: string, contractAddress: string, isSbt: boolean) {
    logger.log("minting nft: " + contractAddress);
    if (!walletAddress == undefined || contractAddress == undefined || isSbt == undefined) {
        return new CustomResponse(400, "Required data is missing");
    }
    try {
        const contract = new ethers.Contract(contractAddress, JSON.parse(childABI), wallet);
        let createReceipt: { wait: () => any; };
        if (isSbt) {
            createReceipt = await contract.safeMintWithTokens(
                walletAddress
            );
        } else {
            createReceipt = await contract.safeMint(
                walletAddress
            );
        }
        logger.log("minting nft: request to solidity sent");
        await createReceipt.wait();
        logger.log("minting nft: request from solidity sent");
        return new CustomResponse(200, "Nft successfully minted");
    } catch (e) {
        logger.log("minting nft: Failed to mint nft " + e);
        return new CustomResponse(500, "Failed to mint nft");
    }
}