import { DefaultAccountContract } from '@aztec/accounts/defaults';
import {
  AccountManager,
  AuthWitness,
  type AuthWitnessProvider,
  type CompleteAddress,
  Fr,
  GrumpkinScalar,
  Schnorr,
  PXE,
  waitForPXE,
  createPXEClient
} from '@aztec/aztec.js';
import { SchnorrHardcodedAccountContractArtifact } from '../src/artifacts/SchnorrHardcodedAccount.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';


// docs:start:account-contract
const PRIVATE_KEY = GrumpkinScalar.fromString('0xd35d743ac0dfe3d6dbe6be8c877cb524a00ab1e3d52d7bada095dfc8894ccfa');

/** Account contract implementation that authenticates txs using Schnorr signatures. */
class SchnorrHardcodedKeyAccountContract extends DefaultAccountContract {
  constructor(private privateKey = PRIVATE_KEY) {
    super(SchnorrHardcodedAccountContractArtifact);
  }

  getDeploymentArgs(): undefined {
    // This contract has no constructor
    return undefined;
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    const privateKey = this.privateKey;
    return {
      createAuthWit(messageHash: Fr): Promise<AuthWitness> {
        const signer = new Schnorr();
        const signature = signer.constructSignature(messageHash.toBuffer(), privateKey);
        return Promise.resolve(new AuthWitness(messageHash, [...signature.toBuffer()]));
      },
    };
  }
}

// docs:end:account-contract
const setupSandbox = async () => {
    const { PXE_URL = 'http://localhost:8080' } = process.env;
    const pxe = await createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    return pxe;
  };

async function main() {

    // Setup PXE connection - same as your working getBlock.ts
let pxe: PXE;
pxe = await setupSandbox();
// docs:start:account-contract-deploy
const secretKey = Fr.random();
const account = new AccountManager(pxe, secretKey, new SchnorrHardcodedKeyAccountContract());
const wallet = await account.waitSetup();
const address = wallet.getCompleteAddress().address;
// docs:end:account-contract-deploy
console.log('Deployed account contract. wallet looks like:', wallet);

// docs:start:account-contract-works
const token = await TokenContract.deploy(wallet, address, 'TokenName', 'TokenSymbol', 18).send().deployed();
console.log('Deployed token contract at:', token.address);

const mintAmount = 50n;
await token.methods.mint_to_private(address, mintAmount).send().wait();

const balance = await token.methods.balance_of_private(address).simulate();
console.log('Balance of wallet is now:', balance);
// docs:end:account-contract-works

}

main();