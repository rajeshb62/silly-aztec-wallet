import { EasyPrivateVotingContract } from "../src/artifacts/EasyPrivateVoting.js";
import { createDebugLogger, Fr, waitForPXE, createPXEClient } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { deriveSigningKey } from '@aztec/circuits.js';
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
const setupSandbox = async () => {
    const { PXE_URL = 'http://localhost:8080' } = process.env;
    const pxe = await createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    return pxe;
};
async function main() {
    let pxe;
    let wallets = [];
    let accounts = [];
    let logger;
    logger = createDebugLogger('aztec:aztec-starter');
    pxe = await setupSandbox();
    wallets = await getInitialTestAccountsWallets(pxe);
    let secretKey = Fr.random();
    let salt = Fr.random();
    let schnorrAccount = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), salt);
    const { address, publicKeys, partialAddress } = schnorrAccount.getCompleteAddress();
    let tx = await schnorrAccount.deploy().wait();
    let wallet = await schnorrAccount.getWallet();
    const votingContract = await EasyPrivateVotingContract.deploy(wallet, address).send().deployed();
    logger.info(`Voting Contract deployed at: ${votingContract.address}`);
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc2NyaXB0cy9kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFxQyx5QkFBeUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFBO0FBQ3BILE9BQU8sRUFBb0QsaUJBQWlCLEVBQUUsRUFBRSxFQUFPLFVBQVUsRUFBWSxlQUFlLEVBQW9ELE1BQU0saUJBQWlCLENBQUM7QUFDeE0sT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFnQixnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXBFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXhFLE1BQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQzVCLE1BQU0sRUFBRSxPQUFPLEdBQUcsdUJBQXVCLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsS0FBSyxVQUFVLElBQUk7SUFFZixJQUFJLEdBQVEsQ0FBQztJQUNiLElBQUksT0FBTyxHQUFvQixFQUFFLENBQUM7SUFDbEMsSUFBSSxRQUFRLEdBQXNCLEVBQUUsQ0FBQztJQUNyQyxJQUFJLE1BQW1CLENBQUM7SUFFeEIsTUFBTSxHQUFHLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFbEQsR0FBRyxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7SUFDM0IsT0FBTyxHQUFHLE1BQU0sNkJBQTZCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbkQsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUV2QixJQUFJLGNBQWMsR0FBRyxNQUFNLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEcsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLEdBQUcsY0FBYyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDcEYsSUFBSSxFQUFFLEdBQUcsTUFBTSxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUMsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFOUMsTUFBTSxjQUFjLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyJ9