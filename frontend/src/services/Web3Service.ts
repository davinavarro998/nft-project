import {ethers} from "ethers";
import abi from "./abi.json";
import { Transaction } from "ethers";
import { Contract } from "ethers";
const CONTRACT_ADDRESS:string = `${process.env.CONTRACT_ADDRESS}`;
const NFT_PRICE:bigint = ethers.parseEther(`${process.env.NFT_PRICE}`);
const CHAIN_ID:number = parseInt(`${process.env.CHAIN_ID}`);

export async function login():Promise<string> {
    if(!window.ethereum) throw new Error("wallet not found!");

    const provider: ethers.BrowserProvider = new ethers.BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);

    if(!accounts || !accounts.length) throw new Error("No permission");

    await provider.send("wallet_switchEthereumChain", [{
        chainId:ethers.toBeHex(CHAIN_ID)
    }]);

    return accounts[0];
}

export async function mint(quantity:number) : Promise<string | null> {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider) as Contract;
    const signer= await provider.getSigner();

    const instance = contract.connect(signer) as Contract;
    const value: bigint = NFT_PRICE * ethers.toBigInt(quantity);
    const tx= await instance.mint(quantity, {value}) as Transaction;

    return tx.hash;
}