import {ethers} from "ethers";
import abi from "./abi.json";
const CONTRACT_ADDRESS:string = `${process.env.CONTRACT_ADDRESS}`;
const NFT_PRICE:bigint = ethers.parseEther(`${process.env.NFT_PRICE}`);
