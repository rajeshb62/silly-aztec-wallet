import { AztecAddress, type AztecAddressLike, type ContractArtifact, ContractBase, ContractFunctionInteraction, type ContractMethod, type ContractNotes, DeployMethod, type FieldLike, type FunctionSelectorLike, PublicKeys, type Wallet } from '@aztec/aztec.js';
export declare const SillyAztecAccountContractArtifact: ContractArtifact;
/**
 * Type-safe interface for contract SillyAztecAccount;
 */
export declare class SillyAztecAccountContract extends ContractBase {
    private constructor();
    /**
     * Creates a contract instance.
     * @param address - The deployed contract's address.
     * @param wallet - The wallet to use when interacting with the contract.
     * @returns A promise that resolves to a new Contract instance.
     */
    static at(address: AztecAddress, wallet: Wallet): Promise<SillyAztecAccountContract>;
    /**
     * Creates a tx to deploy a new instance of this contract.
     */
    static deploy(wallet: Wallet): DeployMethod<SillyAztecAccountContract>;
    /**
     * Creates a tx to deploy a new instance of this contract using the specified public keys hash to derive the address.
     */
    static deployWithPublicKeys(publicKeys: PublicKeys, wallet: Wallet): DeployMethod<SillyAztecAccountContract>;
    /**
     * Creates a tx to deploy a new instance of this contract using the specified constructor method.
     */
    static deployWithOpts<M extends keyof SillyAztecAccountContract['methods']>(opts: {
        publicKeys?: PublicKeys;
        method?: M;
        wallet: Wallet;
    }, ...args: Parameters<SillyAztecAccountContract['methods'][M]>): DeployMethod<SillyAztecAccountContract>;
    /**
     * Returns this contract's artifact.
     */
    static get artifact(): ContractArtifact;
    static get notes(): ContractNotes<'UintNote' | 'ValueNote'>;
    /** Type-safe wrappers for the public methods exposed by the contract. */
    methods: {
        /** compute_note_hash_and_optionally_a_nullifier(contract_address: struct, nonce: field, storage_slot: field, note_type_id: field, compute_nullifier: boolean, serialized_note: array) */
        compute_note_hash_and_optionally_a_nullifier: ((contract_address: AztecAddressLike, nonce: FieldLike, storage_slot: FieldLike, note_type_id: FieldLike, compute_nullifier: boolean, serialized_note: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
        /** constructor() */
        constructor: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
        /** entrypoint(app_payload: struct, fee_payload: struct, cancellable: boolean) */
        entrypoint: ((app_payload: {
            function_calls: {
                args_hash: FieldLike;
                function_selector: FunctionSelectorLike;
                target_address: AztecAddressLike;
                is_public: boolean;
                is_static: boolean;
            }[];
            nonce: FieldLike;
        }, fee_payload: {
            function_calls: {
                args_hash: FieldLike;
                function_selector: FunctionSelectorLike;
                target_address: AztecAddressLike;
                is_public: boolean;
                is_static: boolean;
            }[];
            nonce: FieldLike;
            is_fee_payer: boolean;
        }, cancellable: boolean) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
        /** sync_notes() */
        sync_notes: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
        /** verify_private_authwit(inner_hash: field) */
        verify_private_authwit: ((inner_hash: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
    };
}
//# sourceMappingURL=SillyAztecAccount.d.ts.map