import { DefaultAccountContract } from '@aztec/accounts/defaults';
import { AuthWitness, Fr } from '@aztec/aztec.js';
import { poseidon2Hash } from '@aztec/foundation/crypto';
import { SillyAztecAccountContractArtifact } from '../artifacts/SillyAztecAccount.js';

/** Account contract that validates using password hash */
export class PasswordAccountContract extends DefaultAccountContract {
  constructor() {
    super(SillyAztecAccountContractArtifact);
  }

  getDeploymentArgs(): any[] {
    return [];  // Not undefined, because constructor exists
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