import { DefaultAccountContract } from '@aztec/accounts/defaults';
import {
  AccountManager,
  AuthWitness,
  Fr,
  PXE,
  waitForPXE,
  createPXEClient,
} from '@aztec/aztec.js';
import { poseidon2Hash } from '@aztec/foundation/crypto';
import { GeneratorIndex } from '@aztec/circuits.js';
import { SillyAztecAccountContractArtifact } from '../src/artifacts/SillyAztecAccount.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';

/** Account contract that validates using password hash */
class PasswordAccountContract extends DefaultAccountContract {
  constructor() {
    super(SillyAztecAccountContractArtifact);
  }

  getDeploymentArgs(): undefined {
    return undefined;
  }

  getAuthWitnessProvider() {
    return {
      createAuthWit: async (_messageHash: Fr) => {
        // Create field elements for each character in 'Origin42!'
        const chars = [79, 114, 105, 103, 105, 110, 52, 50, 33];
        const fields = chars.map(char => {
          const buffer = Buffer.alloc(32, 0);
          buffer[31] = char;  // Write in little-endian
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

async function main() {
    const pxe = await createPXEClient(process.env.PXE_URL || 'http://localhost:8080');
    await waitForPXE(pxe);

    const account = new AccountManager(pxe, Fr.random(), new PasswordAccountContract());
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

main();