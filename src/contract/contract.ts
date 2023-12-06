import * as url from "url";
import * as process from "process";

import {ContractEvent} from '../stractures/stractures';
import {CustomResponse} from "../stractures/response";
import {ethers, EventLog} from "ethers";

require("dotenv").config();


const axios = require("axios");


const privKey = process.env.PRIVATE_KEY;
const providerURL = process.env.PROVIDER_URL;

const provider = new ethers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privKey, provider);
const fs = require("fs");

export async function createInternalEvent(event: ContractEvent) {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("creating internal event");
    if (event.name == undefined || event.nftPattern == undefined || event.symbol == undefined || event.countOfRewardTokens == undefined || event.SBTState == undefined) {
        // Return a response to the client
        return new CustomResponse(400, "Required data is missing");
    }

    const contents = fs.readFileSync("src/abi/parent.json");
    const contract = new ethers.Contract(contractAddress, JSON.parse(contents), wallet);
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
        await createReceipt.wait();
        console.log("response received");
        // contract.on("newEvent",())
        let filter = {
            transactionHash: createReceipt.hash,
            topics: [
                ethers.id("newEvent(uint256,string,address,uint256,bool)")
            ]
        };

        return provider.getLogs(filter).then(function (logs) {
            console.log("Printing array of events:");
            // @ts-ignore
            let events = logs.map((log) => new ethers.Interface(JSON.parse(contents)).parseLog(log))
            console.log(events[0]);
            return new CustomResponse(200, "Internal event created successfully", events[0].args[2]);
        }).catch((err) => {
            console.log(err);
            return new CustomResponse(404, "Error while receiving address of contract");
        });


    } catch (e) {
        console.error(e);
        return new CustomResponse(520, "Failed to created event");
    }
}

//newEvent(uint256,string,address,uint256,bool)
export async function mintNft(walletAddress: string, contractAddress: string, isSbt: boolean) {
    console.log("minting nft: " + contractAddress);
    if (!walletAddress == undefined || contractAddress == undefined || isSbt == undefined) {
        return new CustomResponse(400, "Required data is missing");
    }
    const contents = fs.readFileSync("src/abi/child.json");
    try {
        const contract = new ethers.Contract(contractAddress, JSON.parse(contents), wallet);
        let createReceipt = undefined;
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