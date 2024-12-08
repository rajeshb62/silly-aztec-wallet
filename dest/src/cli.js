#!/usr/bin/env node
import { Command } from 'commander';
import { sendTx } from '../scripts/send_tx.js';
// Import other functions as needed
const program = new Command();
program
    .name('silly-wallet')
    .description('CLI tool for wallet operations')
    .version('1.0.0');
program
    .command('send')
    .description('Send a transaction')
    .argument('<arg1>', 'first argument description')
    .argument('<arg2>', 'second argument description')
    .action(async (arg1, arg2) => {
    try {
        await sendTx(arg1, arg2);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsbUNBQW1DO0FBRW5DLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFOUIsT0FBTztLQUNKLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDcEIsV0FBVyxDQUFDLGdDQUFnQyxDQUFDO0tBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVwQixPQUFPO0tBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUNmLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztLQUNqQyxRQUFRLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDO0tBQ2hELFFBQVEsQ0FBQyxRQUFRLEVBQUUsNkJBQTZCLENBQUM7S0FDakQsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDM0IsSUFBSSxDQUFDO1FBQ0gsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMifQ==