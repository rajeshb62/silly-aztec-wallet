import { AztecAddress, Fr, createPXEClient, waitForPXE, Contract, ContractArtifact } from '@aztec/aztec.js';
import { AccountManager } from '@aztec/aztec.js';
import { PasswordAccountContract } from '../../utils/account.js';

export async function simulate(
  methodName: string,
  accountAddress: string, 
  contractAddress: string,
  args: any[],
  contractArtifact: ContractArtifact,
  salt: string
) {
  try {
    // Connect to PXE
    const pxe = await createPXEClient(process.env.PXE_URL || 'http://localhost:8080');
    await waitForPXE(pxe);
    
    console.log('Connected to PXE');

    const account = new AccountManager(
      pxe,
      Fr.ZERO,
      new PasswordAccountContract(),
      Fr.fromString(salt)
    );
    
    const wallet = await account.getWallet();
    console.log("wallet:", wallet.getAddress().toString());
    console.log('Wallet loaded');

    const contract = await Contract.at(
      AztecAddress.fromString(contractAddress),
      contractArtifact,
      wallet
    );
    console.log('Contract loaded');
    
    console.log('Actual args:', args);

    // Convert arguments to proper types
    const functionArgs = args.map(arg => {
      if (arg.startsWith('0x')) {
        return AztecAddress.fromString(arg).toField();
      }
      return Fr.fromString(arg);
    });

    console.log('Function args:', functionArgs);

    // Call view function instead of sending transaction
    const result = await contract.methods[methodName](...functionArgs).simulate();
    console.log('View result:', result.toString());

    return { result };

  } catch (err: any) {
    console.error(`Simulation failed\n ${err.message}`);
    throw err;
  }
} 