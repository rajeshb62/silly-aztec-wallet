import {
  AccountManager,
  Fr,
  createPXEClient,
  waitForPXE,
} from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';
import { PasswordAccountContract } from '../src/utils/account.js';

async function main() {
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

main();