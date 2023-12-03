import * as url from "url";
import * as process from "process";
import {ethers} from "ethers";
import {ContractEvent} from '../stractures/stractures';
import {CustomResponse} from "../stractures/response";

require("dotenv").config();


const axios = require("axios");


const privKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const providerURL = process.env.PROVIDER_URL;


let provider = new ethers.JsonRpcProvider(providerURL);

let wallet = new ethers.Wallet(privKey, provider);

export async function createInternalEvent(event: ContractEvent) {
    console.log("creating internal event");
    if (!event.name==undefined || event.nftPattern==undefined || event.symbol==undefined || event.countOfRewardTokens==undefined || event.SBTState==undefined) {
        // Return a response to the client
        return new CustomResponse(400, "Required data is missing");
    }


    const fs = require("fs");
    const contents = fs.readFileSync("src/abi.json");
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

        return new CustomResponse(200, "Internal event created successfully", createReceipt.hash);
    } catch (e) {
        console.error(e);
        return new CustomResponse(520, "Failed to created event");
    }
};
