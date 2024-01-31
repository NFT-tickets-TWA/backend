import * as process from "process";

import {ContractEvent} from '../util/util';
import {CustomResponse} from "../util/util";
import {ethers} from "ethers";
import fs from "fs";

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const providerURL = process.env.PROVIDER_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privateKey, provider);
const parentABI:string = fs.readFileSync(process.env.PARENT_ABI_PATH).toString();
const childABI:string = fs.readFileSync(process.env.CHILD_ABI_PATH).toString();
const contract = new ethers.Contract(contractAddress, JSON.parse(parentABI), wallet);

async function listenForEvent():Promise<string> {
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
    console.log("creating internal event");
    if (event.name == undefined || event.nftPattern == undefined || event.symbol == undefined || event.countOfRewardTokens == undefined || event.SBTState == undefined) {
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
        console.log("request sent");
        const l = listenForEvent()
        await createReceipt.wait();
        console.log("response received");
        return l.then((addr)=>{
            console.log(addr)
            return new CustomResponse(200, "created", addr);
        }).catch((e)=>{
            console.error(e);
            return new CustomResponse(520, "Failed to created event");
        })
    } catch (e) {
        console.error(e);
        return new CustomResponse(520, "Failed to created event");
    }
}

export async function mintNft(walletAddress: string, contractAddress: string, isSbt: boolean) {
    console.log("minting nft: " + contractAddress);
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
        console.log("request sent");
        await createReceipt.wait();
        console.log("response received");
        return new CustomResponse(200, "Nft successfully minted");
    } catch (e) {
        console.error(e);
        return new CustomResponse(500, "Failed to mint nft");
    }
}