#!/usr/bin/env node
import { Command } from 'commander';
import { send } from './commands/send.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';

const program = new Command();

// Map of supported contract types to their artifacts
const CONTRACT_ARTIFACTS = {
  'token': TokenContract.artifact,
  // We can add more contract types here
  // 'other-contract': OtherContract.artifact,
};

type ContractType = keyof typeof CONTRACT_ARTIFACTS;

program
  .name('silly-wallet')
  .description('CLI tool for wallet operations')
  .version('1.0.0');

program
  .command('send')
  .description('Send a transaction')
  .argument('<contract-type>', 'type of contract (e.g., token)')
  .argument('<method>', 'method name to call')
  .argument('<account-address>', 'account address')
  .argument('<contract-address>', 'contract address')
  .argument('<minter-address>', 'minter address')
  .argument('<amount>', 'amount to mint')
  .action(async (contractType, method, accountAddress, contractAddress, minterAddress, amount) => {
    try {
      if (!(contractType in CONTRACT_ARTIFACTS)) {
        throw new Error(`Unsupported contract type: ${contractType}. Supported types: ${Object.keys(CONTRACT_ARTIFACTS).join(', ')}`);
      }

      const result = await send(
        method, 
        accountAddress, 
        contractAddress, 
        minterAddress, 
        amount,
        CONTRACT_ARTIFACTS[contractType as ContractType]
      );
      console.log('Transaction successful');
      console.log(`Transaction hash: ${result.txHash}`);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse(); 