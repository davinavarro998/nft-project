import hre from 'hardhat';
import {HardhatEthersSigner} from '@nomicfoundation/hardhat-ethers/signers';
import { ProtoNFT, ProtoNFT__factory } from '../typechain-types';

async function main():Promise<void> {
    const networkName:string = (await hre.ethers.provider.getNetwork()).name;

    const signers:HardhatEthersSigner[] = await hre.ethers.getSigners();

    const deployerAccount:HardhatEthersSigner = signers[0];

    const protoNFTFactory:ProtoNFT__factory = await hre.ethers.getContractFactory("ProtoNFT");

    const protoNFTInstance:ProtoNFT = (await protoNFTFactory.deploy()).connect(deployerAccount);

    await protoNFTInstance.waitForDeployment();

    const protoNFTAddress:string = await protoNFTInstance.getAddress();

    console.log(`Network = ${networkName}\nAddress = ${protoNFTAddress}\nDeployer Account = ${deployerAccount.address}`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});