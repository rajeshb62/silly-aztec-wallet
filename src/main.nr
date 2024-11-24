// docs:start:contract
// Account contract that uses Schnorr signatures for authentication using a hardcoded public key.
use dep::aztec::macros::aztec;

#[aztec]
contract SillyAztecAccount {
    use dep::authwit::{
        account::AccountActions,
        auth_witness::get_auth_witness,
        entrypoint::{app::AppPayload, fee::FeePayload},
    };
    use dep::aztec::prelude::PrivateContext;
    use std::hash::poseidon2;
    use dep::aztec::macros::functions::{private, view};
    use dep::aztec::oracle::debug_log::{ debug_log, debug_log_format };


    // Password 'Origin42!' represented as array of ASCII values
    global PASSWORD: [Field; 9] = [
        79,  // 'O'
        114, // 'r'
        105, // 'i'
        103, // 'g'
        105, // 'i'
        110, // 'n'
        52,  // '4'
        50,  // '2'
        33   // '!'
    ];

    // Hash of the password - computed once and stored
    global PASSWORD_HASH: Field = poseidon2::Poseidon2::hash(PASSWORD, 9);  // Length is 9

    

    // Note: If you globally change the entrypoint signature don't forget to update account_entrypoint.ts
    #[private]
    fn entrypoint(app_payload: AppPayload, fee_payload: FeePayload, cancellable: bool) {
        let actions = AccountActions::init(&mut context, is_valid_impl);
        actions.entrypoint(app_payload, fee_payload, cancellable);
    }

    #[private]
    #[view]
    fn verify_private_authwit(inner_hash: Field) -> Field {
        let actions = AccountActions::init(&mut context, is_valid_impl);
        actions.verify_private_authwit(inner_hash)
    }

    #[contract_library_method]
    fn is_valid_impl(_context: &mut PrivateContext, outer_hash: Field) -> bool {
        debug_log("Comparing hashes zaza:");
        debug_log_format("PASSWORD_HASH kuku: {}", [PASSWORD_HASH]);
        debug_log_format("outer_hash zuzu: {}", [outer_hash]);
        
        // Get witness from outer_hash
        let witness: [Field; 1] = unsafe { get_auth_witness(outer_hash) };
        debug_log("Got witness papu:");
        debug_log_format("Witness: {}", [witness[0]]);
        
        witness[0] == PASSWORD_HASH
    }
}
// docs:end:contract