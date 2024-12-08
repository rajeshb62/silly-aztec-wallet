import { DefaultAccountContract } from '@aztec/accounts/defaults';
import { AccountManager, AuthWitness, Fr, waitForPXE, createPXEClient, } from '@aztec/aztec.js';
import { poseidon2Hash } from '@aztec/foundation/crypto';
import { SillyAztecAccountContractArtifact } from '../src/artifacts/SillyAztecAccount.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';
/** Account contract that validates using password hash */
class PasswordAccountContract extends DefaultAccountContract {
    constructor() {
        super(SillyAztecAccountContractArtifact);
    }
    //this returns a empty array (not undefined) when the constructor exists, and when constructor does not exist it returns undefined
    getDeploymentArgs() {
        return []; // Not undefined, because constructor exists
    }
    getAuthWitnessProvider() {
        return {
            createAuthWit: async (_messageHash) => {
                // Create field elements for each character in 'Origin42!'
                const chars = [79, 114, 105, 103, 105, 110, 52, 50, 33];
                const fields = chars.map(char => {
                    const buffer = Buffer.alloc(32, 0);
                    buffer[31] = char; // Write in little-endian
                    return Fr.fromBuffer(buffer);
                });
                console.log(`Field values:`, fields.map(f => f.toString()));
                // Hash all field elements
                const passwordHash = poseidon2Hash(fields);
                console.log('Password hash:', passwordHash.toString());
                const witness = new AuthWitness(_messageHash, [passwordHash]);
                console.log('Created witness with:', {
                    hash: _messageHash.toString(),
                    args: [passwordHash.toString()]
                });
                return witness;
            }
        };
    }
}
export async function sendTx(arg1, arg2) {
    const pxe = await createPXEClient(process.env.PXE_URL || 'http://localhost:8080');
    await waitForPXE(pxe);
    const account = new AccountManager(pxe, Fr.zero(), new PasswordAccountContract());
    const wallet = await account.waitSetup();
    const address = wallet.getCompleteAddress().address;
    console.log('Deployed account contract. wallet looks like:', wallet);
    const token = await TokenContract.deploy(wallet, address, 'TokenName', 'TokenSymbol', 18).send().deployed();
    console.log('Deployed token contract at:', token.address);
    const mintAmount = 50n;
    await token.methods.mint_to_private(address, address, mintAmount).send().wait();
    const balance = await token.methods.balance_of_private(address).simulate();
    console.log('Balance of wallet is now:', balance);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZF90eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NjcmlwdHMvc2VuZF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQ0wsY0FBYyxFQUNkLFdBQVcsRUFDWCxFQUFFLEVBRUYsVUFBVSxFQUNWLGVBQWUsR0FDaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFekQsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDMUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRS9ELDBEQUEwRDtBQUMxRCxNQUFNLHVCQUF3QixTQUFRLHNCQUFzQjtJQUMxRDtRQUNFLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDSCxrSUFBa0k7SUFDaEksaUJBQWlCO1FBQ2YsT0FBTyxFQUFFLENBQUMsQ0FBRSw0Q0FBNEM7SUFDMUQsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixPQUFPO1lBQ0wsYUFBYSxFQUFFLEtBQUssRUFBRSxZQUFnQixFQUFFLEVBQUU7Z0JBQ3hDLDBEQUEwRDtnQkFDMUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM5QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFFLHlCQUF5QjtvQkFDN0MsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFNUQsMEJBQTBCO2dCQUMxQixNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBRXZELE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUU7b0JBQ2pDLElBQUksRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFO29CQUM3QixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ2xDLENBQUMsQ0FBQztnQkFFSCxPQUFPLE9BQU8sQ0FBQztZQUNqQixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsTUFBTSxDQUFDLElBQVksRUFBRSxJQUFZO0lBQ25ELE1BQU0sR0FBRyxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLHVCQUF1QixDQUFDLENBQUM7SUFDbEYsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLHVCQUF1QixFQUFFLENBQUMsQ0FBQztJQUNsRixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVyRSxNQUFNLEtBQUssR0FBRyxNQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzVHLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTFELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUN2QixNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFaEYsTUFBTSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEQsQ0FBQyJ9