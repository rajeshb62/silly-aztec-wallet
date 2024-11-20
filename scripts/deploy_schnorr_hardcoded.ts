import { PXE, waitForPXE, createPXEClient } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { Fr, deriveSigningKey } from '@aztec/circuits.js';
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { SchnorrHardcodedAccountContract } from '../src/artifacts/SchnorrHardcodedAccount.js';

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
    console.log('PXE connected');
    let block = await pxe.getBlock(2);
    console.log("connected to pxe");
    //console.log(block)
    console.log(block?.hash())
    // Create Schnorr account
    const secretKey = Fr.random();
    const salt = Fr.random();
    const schnorrAccount = await getSchnorrAccount(
      pxe,
      secretKey,
      deriveSigningKey(secretKey),
      salt
    );

    // Deploy account
    console.log('Deploying Schnorr account...');
    const tx = await schnorrAccount.deploy().wait();
    const wallet = await schnorrAccount.getWallet();
    
    // Deploy hardcoded account contract
    console.log('Deploying hardcoded account contract...');
    const hardcodedAccount = await SchnorrHardcodedAccountContract.deploy(wallet)
    .send()
    .deployed();
    
    console.log('Deployed at:', hardcodedAccount.address.toString());
    console.log("hardcoded account wallet object:", hardcodedAccount.wallet);
    const wallet_h = hardcodedAccount.wallet;
    const address = wallet_h.getCompleteAddress().address;
    console.log('wallet object looks like:', wallet)
    
} 

main();