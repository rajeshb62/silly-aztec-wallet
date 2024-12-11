import { AztecAddress, Fr, createPXEClient, waitForPXE, Contract, ContractArtifact } from '@aztec/aztec.js';
import { AccountManager } from '@aztec/aztec.js';
import { PasswordAccountContract } from '../../utils/account.js';

export async function send(
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
    
    // Filter out only the string arguments we care about
    // const actualArgs = args.filter(arg => typeof arg === 'string');
    console.log('Actual args:', args);

    // Convert all arguments to Fr since mint_to_public expects Fields
    const functionArgs = args.map(arg => {
      if (arg.startsWith('0x')) {
        // For hex addresses, first convert to AztecAddress then to field
        return AztecAddress.fromString(arg).toField();
      }
      // For regular numbers
      return Fr.fromString(arg);
    });
    console.log(functionArgs);
    const call = contract.methods[methodName](...functionArgs);

    // Send transaction
    const nonce = Fr.random();
    const tx = await call.send({ nonce });

    console.log('Transaction sent');

    // Wait for transaction
    await tx.wait();
    console.log('Transaction has been mined');

    // Get receipt
    const receipt = await tx.getReceipt();
    console.log(` Tx hash: ${receipt.txHash}`);
    console.log(` Tx fee: ${receipt.transactionFee}`);
    console.log(` Status: ${receipt.status}`);
    console.log(` Block number: ${receipt.blockNumber}`);

    return {
      txHash: receipt.txHash,
      nonce
    };

  } catch (err: any) {
    console.error(`Transaction failed\n ${err.message}`);
    throw err;
  }
} 