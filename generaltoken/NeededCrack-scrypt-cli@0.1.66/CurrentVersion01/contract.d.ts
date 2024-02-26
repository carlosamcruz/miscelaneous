import "reflect-metadata";
import { bsv, Artifact, PubKeyHash, VerifyResult, CallData, AsmVarValues } from "scryptlib";
import { ByteString, PrivKey, PubKey, Sig, SigHashPreimage, SigHashType } from "./builtins/types";
import { Provider, TransactionResponse } from "../bsv/abstract-provider";
import { Signer } from "../bsv/abstract-signer";
import { AddressOption, UTXO } from "../bsv/types";
import { TranspileError } from "./transformation/types";
import { ContractTransaction, MethodCallTxBuilder, MultiContractCallOptions, MultiContractTransaction } from "./types/contract-call";
/**
 * A reference to an input of a transaction
 */
export interface TxInputRef {
    /** transaction object */
    tx: bsv.Transaction;
    /** an index indicating the position of inputs in this transaction */
    inputIndex: number;
}
/**
 * A reference to an output of a transaction
 */
export interface TxOutputRef {
    /** transaction object */
    tx: bsv.Transaction;
    /** index of an output in this transaction */
    outputIndex: number;
}
/**
 * The structure used to refer to a particular transaction output
 */
export interface Outpoint {
    /** txid of the transaction holding the output */
    txid: ByteString;
    /** index of the specific output */
    outputIndex: bigint;
}
/**
 * ScriptContext contains all the information in the transaction's [preimage]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}.
 * The preimage is automatically generated during the user's construction of the transaction,
 * and the user does not need to calculate it explicitly
 */
export interface ScriptContext {
    /** version number of [transaction]{@link https://wiki.bitcoinsv.io/index.php/Bitcoin_Transactions#General_format_of_a_Bitcoin_transaction} */
    version: ByteString;
    /** the specific UTXO spent by this transaction input */
    utxo: {
        /** locking script */
        script: ByteString;
        /** amount in satoshis */
        value: bigint;
        /** outpoint referenced by this UTXO */
        outpoint: Outpoint;
    };
    /** double-SHA256 hash of the serialization of some/all input outpoints, see [hashPrevouts]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#hashprevouts} */
    hashPrevouts: ByteString;
    /** double-SHA256 hash of the serialization of some/all input sequence values, see [hashSequence]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#hashsequence} */
    hashSequence: ByteString;
    /** sequence number of [transaction input]{@link https://wiki.bitcoinsv.io/index.php/Bitcoin_Transactions#Format_of_a_Transaction_Input} */
    sequence: bigint;
    /** double-SHA256 hash of the serialization of some/all output amount with its locking script, see [hashOutputs]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#hashoutputs} */
    hashOutputs: ByteString;
    /** locktime of [transaction]{@link https://wiki.bitcoinsv.io/index.php/Bitcoin_Transactions#General_format_of_a_Bitcoin_transaction} */
    locktime: bigint;
    /** [SIGHASH flag]{@link https://wiki.bitcoinsv.io/index.php/SIGHASH_flags} used by this input */
    sigHashType: SigHashType;
    /** get the whole serialized sighash preimage */
    serialize(): SigHashPreimage;
}
type SamePromiseOrValue<A extends Promise<unknown> | unknown, B> = A extends Promise<unknown> ? Promise<B> : B;
/**
 * @ignore
 * DebugFunctions contains a set of functions for debugging contracts at runtime.
 * All debugging functions will not affect the execution results of the contract.
 */
interface DebugFunctions {
    /**
     * Compare the difference between the outputs argument and all the outputs of the transaction bound by `this.to`,
     * which are serialized and hashed to produce `this.ctx.hashOutputs`.
     */
    diffOutputs: (outputs: ByteString) => void;
    /**
     * generate a scrypt debugger launch configuration
     */
    genLaunchConfig: () => void;
}
/**
 * The main contract class. To write a contract, extend this class as such:
 * @example
 *  ```ts
 * class YourSmartContract extends SmartContract {
 *   // your smart contract code here
 * }
 * ```
 * @category SmartContract
 */
export declare class SmartContract {
    /**
     * `from` is a reference to a transaction output where the props of `this` contract instance are located/stored on chain.
     * In other words, it's the start point for the lifecycle of `this` instance.
     */
    from?: TxOutputRef | UTXO;
    /**
     * `to` is a reference to a transaction input where a public method of `this` contract instance is called.
     * In other words, it's the end point for the lifecycle of `this` instance.
     */
    to?: TxInputRef;
    /** @ignore */
    _csNum: number;
    /** @ignore */
    _ctx?: ScriptContext;
    /** @ignore */
    private _currentMethod?;
    /** @ignore */
    private static DelegateClazz;
    /** @ignore */
    private delegateInstance;
    /** @ignore */
    private static compileImpl;
    /**
     * compiling the scrypt source which is the output of transpiling. Calling this function to output the contract artifact file.
     * only used for testing.
     * This function should not be called in production environment.
     * @returns {Artifact} if compiling succeed, otherwise it throws error.
     */
    static compile(): Promise<Artifact>;
    /** @ignore */
    static getTranspileErrors(): Promise<TranspileError[]>;
    /**
     * This function is usually called on the frontend.
     * The contract class needs to call this function before instantiating.
     * @param artifactFile a merged contract artifact object, or its file path
     */
    static loadArtifact(artifactFile?: Artifact | string | undefined): void;
    /**
     *
     * The contract class needs to call this function before instantiating.
     * @param artifact a merged contract artifact object
     */
    static getArtifact(): Artifact;
    /** @ignore */
    private static _getTransformationResult;
    /** @ignore */
    private static _getScryptFilePath;
    /** @ignore */
    private static _loadCachedArtifact;
    /** @ignore */
    private static _loadArtifact;
    /** @ignore */
    private getDelegateClazz;
    constructor(...args: any[]);
    private _initDelegateInstance;
    /**
     * Only inherited classes can call this function.
     * Direct subclasses of `SmartContract` do not need to call this function.
     * @param args  constructor parameters of inherited classes
     * @onchain
     */
    init(...args: any[]): void;
    /**
     * Execute the contract
     * @ignore
     * @deprecated
     */
    verify<T extends Promise<void> | void>(entryMethodInvoking: (self: this) => T): SamePromiseOrValue<T, VerifyResult>;
    /**
     * get unlocking script of the contract
     * @ignore
     * @deprecated
     * @example
     *  ```ts
     * instance.getUnlockingScript((self) => {
     *    self.to = { tx, inputIndex }
     *    // call self's public method to get the unlocking script.
     *    self.unlock(..args);
     * })
     * ```
     */
    getUnlockingScript<T extends Promise<void> | void>(callPub: (self: this) => T): SamePromiseOrValue<T, bsv.Script>;
    /**
     * sync properties values to delegateInstance iff it's not the genesis.
     * @ignore
     */
    private syncStateProps;
    /**
     * Returns a lockingScript of contract.
     */
    get lockingScript(): bsv.Script;
    /**
     * Returns script size of lockingScript.
     */
    get scriptSize(): number;
    /**
     * Returns code part of the lockingScript, in hex format.
     */
    get codePart(): string;
    /**
     * Returns sha256 hash of the current locking script, formatted as a LE hex string.
     */
    get scriptHash(): string;
    /**
     * If the compiled contract contains any ASM variable templates (e.g. P2PKH.unlock.pubKeyHash),
     * replace them with the passed values.
     * @param {AsmVarValues} asmVarValues type that contains the actual values.
     * @returns {void}
     */
    setAsmVars(asmVarValues: AsmVarValues): void;
    /**
     * Returns set ASM variable values.
     */
    get asmArgs(): AsmVarValues;
    /**
     * Deep clone the contract instance.
     * @ignore
     * @param opt properties that only references are copied, but not deep clone their values.
     * @returns a cloned contract instance
     */
    private clone;
    /**
     *
     * @param opt properties that only references are copied, but not deep clone their values.
     * @returns a cloned contract instance with `this.from = undefined` and `this.to = undefined`
     */
    next(opt?: {
        refCloneProps?: string[];
    }): this;
    /**
     * Mark the contract as genesis contracts
     */
    markAsGenesis(): this;
    /**
     * A built-in function to create an output containing the new state. It takes an input: the number of satoshis in the output.
     * @onchain
     * @param amount the number of satoshis in the output
     * @returns an output containing the new state
     */
    buildStateOutput(amount: bigint): ByteString;
    /**
     * A built-in function to create an [change output]{@link https://wiki.bitcoinsv.io/index.php/Change}.
     * @onchain
     * @returns
     */
    buildChangeOutput(): ByteString;
    /**
     * A built-in function to create a locking script containing the new state.
     * @onchain
     * @returns a locking script that containing the new state
     */
    getStateScript(): ByteString;
    /**
     * A built-in function verifies an ECDSA signature. It takes two inputs from the stack, a public key (on top of the stack) and an ECDSA signature in its DER_CANONISED format concatenated with sighash flags. It outputs true or false on the stack based on whether the signature check passes or fails.
     * @onchain
     * @category Signature Verification
     * @see https://wiki.bitcoinsv.io/index.php/Opcodes_used_in_Bitcoin_Script
     */
    checkSig(signature: Sig, publickey: PubKey, errorMsg?: string): boolean;
    /**
     * Same as `checkPreimage`, but support customized more settings.
     * @onchain
     * @param txPreimage  The format of the preimage is [specified]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}
     * @param privKey private Key
     * @param pubKey public key
     * @param inverseK inverseK
     * @param r r
     * @param rBigEndian must be mininally encoded, to conform to strict DER rule https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki#der-encoding
     * @param sigHashType A SIGHASH flag is used to indicate which part of the transaction is signed by the ECDSA signature.
     * @returns  true if `txPreimage` is the preimage of the current transaction. Otherwise false.
     */
    checkPreimageAdvanced(txPreimage: SigHashPreimage, privKey: PrivKey, pubKey: PubKey, inverseK: bigint, r: bigint, rBigEndian: string, sigHashType: SigHashType): boolean;
    /**
     * Same as `checkPreimage`, but support customized sighash type
     * @onchain
     * @param txPreimage The format of the preimage is [specified]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}
     * @param sigHashType A SIGHASH flag is used to indicate which part of the transaction is signed by the ECDSA signature.
     * @returns true if `txPreimage` is the preimage of the current transaction. Otherwise false.
     */
    checkPreimageSigHashType(txPreimage: SigHashPreimage, sigHashType: SigHashType): boolean;
    /**
     * Using the [OP_PUSH_TX]{@link https://medium.com/@xiaohuiliu/op-push-tx-3d3d279174c1} technique, check if `txPreimage` is the preimage of the current transaction.
     * @onchain
     * @param txPreimage The format of the preimage is [specified]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}
     * @returns true if `txPreimage` is the preimage of the current transaction. Otherwise false.
     */
    checkPreimage(txPreimage: SigHashPreimage): boolean;
    /**
     * Insert and OP_CODESEPARATOR at this point of the functions logic.
     * More detail about [OP_CODESEPARATOR]{@link https://wiki.bitcoinsv.io/index.php/OP_CODESEPARATOR}
     */
    insertCodeSeparator(): void;
    /**
     * Compares the first signature against each public key until it finds an ECDSA match. Starting with the subsequent public key, it compares the second signature against each remaining public key until it finds an ECDSA match. The process is repeated until all signatures have been checked or not enough public keys remain to produce a successful result. All signatures need to match a public key. Because public keys are not checked again if they fail any signature comparison, signatures must be placed in the scriptSig using the same order as their corresponding public keys were placed in the scriptPubKey or redeemScript. If all signatures are valid, 1 is returned, 0 otherwise. Due to a bug, one extra unused value is removed from the stack.
     * @onchain
     * @category Signature Verification
     * @see https://wiki.bitcoinsv.io/index.php/Opcodes_used_in_Bitcoin_Script
     */
    checkMultiSig(signatures: Sig[], publickeys: PubKey[]): boolean;
    /**
     * Implements a time-based lock on a transaction until a specified `locktime` has been reached.
     * The lock can be based on either block height or a UNIX timestamp.
     *
     * If the `locktime` is below 500,000,000, it's interpreted as a block height. Otherwise,
     * it's interpreted as a UNIX timestamp. This function checks and ensures that the transaction's
     * nSequence is less than `UINT_MAX`, and that the provided `locktime` has been reached or passed.
     *
     * @param {bigint} locktime - The block height or timestamp until which the transaction should be locked.
     * @returns If `true` is returned, nlockTime and sequence in `this.ctx` are valid, otherwise they are invalid.
     * @onchain
     * @category Time Lock
     * @see https://docs.scrypt.io/tutorials/timeLock
     */
    timeLock(locktime: bigint): boolean;
    /**
     * Get the amount of the change output for `to.tx`.
     * @onchain
     * @returns amount in satoshis
     */
    get changeAmount(): bigint;
    /**
   * Get the prevouts for `to.tx`.
   * @onchain
   * @returns prevouts in satoshis
   */
    get prevouts(): ByteString;
    /**
     * Get the change address of the change output for `to.tx`.
     * @onchain
     * @returns the change address of to.tx
     */
    get changeAddress(): PubKeyHash;
    /**
     * @ignore
     * @param publickey
     * @returns true publickey valid.
     */
    private checkPubkeyEncoding;
    /**
     * @ignore
     * @param signature
     * @returns true signature valid.
     */
    private checkSignatureEncoding;
    private hasPrevouts;
    /**
     * call delegateInstance method
     * @ignore
     * @param methodName
     * @param args
     * @returns
     */
    private callDelegatedMethod;
    /**
     * Call the public function on the delegateInstance
     * @ignore
     * @param methodName
     * @param args
     * @returns a `FunctionCall` that contains a unlocking script
     */
    private encodeMethodCall;
    /**
     * Set `this.ctx` by a `SigHashPreimage`
     * @ignore
     * @param txPreimage
     */
    private setCtx;
    /** @ignore */
    private clearCtx;
    /** @ignore */
    private entryMethodCall?;
    /**
     * set the data part of the contract in ASM format
     * @param dataPart
     */
    setDataPartInASM(dataPart: string): void;
    /**
     * set the data part of the contract in hex format
     * @param dataPart
     */
    setDataPartInHex(dataPart: string): void;
    get dataPart(): bsv.Script | undefined;
    /** @ignore */
    private enableUpdateEMC;
    /** @ignore */
    private buildEntryMethodCall;
    /** @ignore */
    private _assertToExist;
    /** @ignore */
    private _assertFromExist;
    /** @ignore */
    _provider?: Provider;
    /** @ignore */
    _signer?: Signer;
    /**
     * connect a provider or a signer.
     * @param providerOrSigner a provider or a signer
     */
    connect(providerOrSigner: Provider | Signer): Promise<void>;
    /**
     * Get the connected [signer]{@link https://docs.scrypt.io/how-to-test-a-contract#signer}
     */
    get signer(): Signer;
    /**
     * Get the connected [provider]{@link https://docs.scrypt.io/how-to-test-a-contract#provider}
     */
    get provider(): Provider | undefined;
    /**
     * creates a tx to deploy the contract. Users override it to cutomize a deployment tx as below.
     * @example
     * ```ts
     * override async buildDeployTransaction(utxos: UTXO[], amount: number, changeAddress?: bsv.Address | string): Promise<bsv.Transaction> {
     *  const deployTx = new bsv.Transaction()
     *  // add p2pkh inputs for paying tx fees
     *  .from(utxos)
     *  // add contract output
     *  .addOutput(new bsv.Transaction.Output({
     *    script: this.lockingScript,
     *    satoshis: amount,
     *  }))
     *  // add the change output if passing `changeAddress`
     *  if (changeAddress) {
     *    deployTx.change(changeAddress);
     *    if (this._provider) {
     *      deployTx.feePerKb(await this.provider.getFeePerKb());
     *    }
     *  }
     *
     *  return deployTx;
     * }
     * ```
     * @param utxos represents one or more P2PKH inputs for paying transaction fees.
     * @param amount the balance of contract output
     * @param changeAddress a change address
     * @returns
     */
    buildDeployTransaction(utxos: UTXO[], amount: number, changeAddress: bsv.Address | string): Promise<bsv.Transaction>;
    /**
     * Deploy the contract
     * @param amount satoshis locked in the contract, 1 sat by default
     * @param options An optional parameter that can specify the change address
     * @returns The transaction id of the successfully deployed contract
     */
    deploy(amount?: number, options?: {
        changeAddress?: AddressOption;
        address?: AddressOption;
    }): Promise<TransactionResponse>;
    /** @ignore */
    private _prepareArgsForMethodCall;
    private call;
    private singleContractCall;
    private multiContractCall;


    ////////////////////////////////////////////
    //Jesus is the Lord
    ////////////////////////////////////////////

    private multiContractCallDummy;
    ////////////////////////////////////////////
    ////////////////////////////////////////////

    private signSingleCallTx;
    private dummySignSingleCallTx;
    /**
     * An object to access all public `@method`s
     */
    get methods(): Record<string, (...args: any) => Promise<ContractTransaction>>;
    /** @ignore */
    private getTxBuilder;
    /**
     * Bind a transation builder for a public `@method`
     * @param methodName the public `@method` name
     * @param txBuilder a transation builder
     */
    bindTxBuilder(methodName: string, txBuilder: MethodCallTxBuilder<this>): void;
    /** @ignore */
    private _txBuilders;
    /** @ignore */
    private static defaultCallTxBuilder;
    /**
     * Build an input that includes the contract
     * @param fromUTXO A parameter to specify the `utxo` where the contract is located
     * @returns an input that includes the contract
     */
    buildContractInput(fromUTXO?: UTXO): bsv.Transaction.Input;
    /**
     * Check if the contract is a stateful contract
     * @returns true if contract has a `@prop(true)` property
     */
    isStateful(): boolean;
    /**
     * Get [sigHash type]{@link https://docs.scrypt.io/how-to-write-a-contract/scriptcontext#sighash-type} of the public `@method` function.
     * @param methodName name of the public `@method` function.
     * @returns a sigHash type
     */
    sigTypeOfMethod(methodName: string): number;
    /** @ignore */
    private getMethodsMeta;
    /** @ignore */
    private diffOutputs;
    /**
     * A set of functions for debugging contracts, which can only be called in `@method` methods.
     */
    get debug(): DebugFunctions;
    /**
    * Get the current locked balance of the contract
    */
    get balance(): number;
    /**
     * Get the utxo where the contract is currently located
     */
    get utxo(): UTXO;
    /**
     * You can directly access the context through `this.ctx` in any public @method.
     * [ScriptContext]{@link https://docs.scrypt.io/how-to-write-a-contract/scriptcontext} can be considered additional information a public method gets when called, besides its function parameters.
     * @onchain
     */
    get ctx(): ScriptContext;
    /**
     * @ignore
     * recover a `SmartContract` instance from the locking script
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this locking script moment
     * @param script hex string of locking script
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this locking script moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromLockingScript(script: string, offchainValues?: Record<string, any>, nopScript?: bsv.Script): SmartContract;
    /**
     * recover a `SmartContract` instance from the transaction
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this transaction moment
     * @param tx transaction
     * @param atOutputIndex output index of `tx`
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this transaction moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromTx<T extends SmartContract>(this: new (...args: any[]) => T, tx: bsv.Transaction, atOutputIndex: number, offchainValues?: Record<string, any>, nopScript?: bsv.Script): T;
    /**
     * recover a `SmartContract` instance from the transaction
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this transaction moment
     * @param tx transaction
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this transaction moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromUTXO<T extends SmartContract>(this: new (...args: any[]) => T, utxo: UTXO, offchainValues?: Record<string, any>, nopScript?: bsv.Script): T;
    /** @ignore */
    private static dummySignMultiCallTx;
    /** @ignore */
    private static signMultiCallTx;
    /**
    * When the `@method`s of multiple contracts is called in a transaction, this function signs and broadcasts the final transaction.
    * @param partialContractTx a `ContractTransation` with a unsigned transation.
    * @param signer a signer to sign the transation.
    * @returns a `MultiContractTransation` with a signed transation.
    */
    static multiContractCall(partialContractTx: ContractTransaction, signer: Signer, options?: MultiContractCallOptions): Promise<MultiContractTransaction>;
    /**
     * parse call data when a contract public method called in a transation.
     * @param tx
     * @param inputIndex
     * @returns
     */

    //////////////////////////////
    //Jesus is the Lord
    //////////////////////////////
    static multiContractCallDummy(partialContractTx: ContractTransaction, signer: Signer, options?: MultiContractCallOptions): Promise<MultiContractTransaction>;
    /**
     * parse call data when a contract public method called in a transation.
     * @param tx
     * @param inputIndex
     * @returns
     */

    static multiContractCallV2(partialContractTx: ContractTransaction, signer: Signer, options?: MultiContractCallOptions): Promise<string>;
    /**
     * parse call data when a contract public method called in a transation.
     * @param tx
     * @param inputIndex
     * @returns
     */

    static dummyFlagOff(): Promise<MultiContractTransaction>;
     
    ///////////////////////////////
    ///////////////////////////////


    static parseCallData(tx: bsv.Transaction, inputIndex: number): CallData;
    /** @ignore */
    private static autoPayfee;
    prependNOPScript(nopScript: bsv.Script | null): void;
    getPrependNOPScript(): bsv.Script | null;
}
export {};
