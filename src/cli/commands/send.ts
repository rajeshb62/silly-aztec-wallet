import { AztecAddress, Fr, createPXEClient, waitForPXE, Contract, ContractArtifact } from '@aztec/aztec.js';
import { AccountManager } from '@aztec/aztec.js';
import { PasswordAccountContract } from '../../utils/account.js';

export async function send(
  methodName: string,
  accountAddress: string, 
  contractAddress: string,
  minterAddress: string,
  amount: string,
  contractArtifact: ContractArtifact
) {
  try {
    // Connect to PXE
    const pxe = await createPXEClient(process.env.PXE_URL || 'http://localhost:8080');
    await waitForPXE(pxe);
    
    console.log('Connected to PXE');

    // Get account using custom PasswordAccountContract
    const account = new AccountManager(
      pxe,
      Fr.ZERO,
      new PasswordAccountContract(),
      Fr.fromString('0x268b4064751e9d98e9da30bb2b89c25eb21f35c0cc4e620a9ec384377ca6e088')
    );
    
    const wallet = await account.getWallet();
    
    // Add detailed wallet logging
    console.log('Wallet details:');
    console.log('  Address:', wallet.getAddress().toString());
    console.log('  Complete Address:', wallet.getCompleteAddress());
    console.log('Wallet loaded');

    // Get contract instance using provided artifact
    const contract = await Contract.at(
      AztecAddress.fromString(contractAddress),
      contractArtifact,
      wallet
    );
    console.log('Contract loaded');

    // Prepare function arguments
    const functionArgs = [
      Fr.fromString(minterAddress),
      Fr.fromString(amount)
    ];

    // Call the method
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
    // console.log(` Block hash: ${receipt.blockHash?.toString('hex')}`);

    return {
      txHash: receipt.txHash,
      nonce
    };

  } catch (err: any) {
    console.error(`Transaction failed\n ${err.message}`);
    throw err;
  }
} 