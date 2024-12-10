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
} as const;

// Create a type from the keys of CONTRACT_ARTIFACTS
type ContractType = keyof typeof CONTRACT_ARTIFACTS;

program
  .name('silly-wallet')
  .description('CLI tool for wallet operations')
  .version('1.0.0');

program
  .command('send')
  .description('Send a transaction to an Aztec contract')
  .argument('<contract-type>', 'type of contract (e.g., token)')
  .argument('<method>', 'method name to call')
  .option('-a, --account <address>', 'account address to send from')
  .option('-c, --contract <address>', 'contract address to call')
  .option('-p, --params <values...>', 'method parameters')
  .action(async (contractType: ContractType, method, options) => {
    try {
      console.log('Options:', options);

      if (!options.account || !options.contract) {
        throw new Error('Account and contract addresses are required');
      }

      const result = await send(
        method,
        options.account,
        options.contract,
        options.params || [],
        CONTRACT_ARTIFACTS[contractType]
      );

      console.log('Transaction successful');
      console.log(`Transaction hash: ${result.txHash}`);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse(); 