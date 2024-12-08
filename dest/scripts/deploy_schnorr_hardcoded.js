import { waitForPXE, createPXEClient, Contract } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { Fr, deriveSigningKey } from '@aztec/circuits.js';
import { SillyAztecAccountContractArtifact } from '../src/artifacts/SillyAztecAccount.js';
const setupSandbox = async () => {
    const { PXE_URL = 'http://localhost:8080' } = process.env;
    const pxe = await createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    return pxe;
};
async function main() {
    // Setup PXE connection - same as your working getBlock.ts
    let pxe;
    pxe = await setupSandbox();
    console.log('PXE connected');
    let block = await pxe.getBlock(2);
    console.log("connected to pxe");
    //console.log(block)
    console.log(block?.hash());
    // Create Schnorr account
    const secretKey = Fr.random();
    const salt = Fr.random();
    const schnorrAccount = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), salt);
    // Deploy account
    console.log('Deploying Schnorr account...');
    const tx = await schnorrAccount.deploy().wait();
    const wallet = await schnorrAccount.getWallet();
    // Deploy hardcoded account contract
    console.log('Deploying hardcoded account contract...');
    const hardcodedAccount = await Contract.deploy(wallet, SillyAztecAccountContractArtifact, [])
        .send()
        .deployed();
    console.log('Deployed at:', hardcodedAccount.address.toString());
    console.log("hardcoded account wallet object:", hardcodedAccount);
    const address = wallet.getCompleteAddress().address;
    console.log('wallet object looks like:', wallet);
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95X3NjaG5vcnJfaGFyZGNvZGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc2NyaXB0cy9kZXBsb3lfc2Nobm9ycl9oYXJkY29kZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFPLFVBQVUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFELE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRTFGLE1BQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQzlCLE1BQU0sRUFBRSxPQUFPLEdBQUcsdUJBQXVCLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsS0FBSyxVQUFVLElBQUk7SUFFZiwwREFBMEQ7SUFDMUQsSUFBSSxHQUFRLENBQUM7SUFDYixHQUFHLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzdCLElBQUksS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDaEMsb0JBQW9CO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDMUIseUJBQXlCO0lBQ3pCLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM5QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekIsTUFBTSxjQUFjLEdBQUcsTUFBTSxpQkFBaUIsQ0FDNUMsR0FBRyxFQUNILFNBQVMsRUFDVCxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFDM0IsSUFBSSxDQUNMLENBQUM7SUFFRixpQkFBaUI7SUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sRUFBRSxHQUFHLE1BQU0sY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hELE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBRWhELG9DQUFvQztJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFDdkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLEVBQUUsQ0FBQztTQUN4RixJQUFJLEVBQUU7U0FDTixRQUFRLEVBQUUsQ0FBQztJQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNqRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIn0=