"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContract = void 0;
const fs = __importStar(require("fs"));
const os_1 = require("os");
const path_1 = require("path");
require("reflect-metadata");
const scryptlib_1 = require("scryptlib");
const indexerReader_1 = require("./transformation/indexerReader");
const lodash_1 = require("lodash");
const functions_1 = require("./builtins/functions");
const types_1 = require("./builtins/types");
const crypto_1 = require("crypto");
const abstract_provider_1 = require("../bsv/abstract-provider");
const abstract_signer_1 = require("../bsv/abstract-signer");
const utils_1 = require("../bsv/utils");
const utils_2 = require("./utils");
const decorators_1 = require("./decorators");
const library_1 = require("./library");
const diffUtils_1 = require("./utils/diffUtils");
const utils_3 = require("./utils");
const error_1 = require("./utils/error");

///////////////////////
//Jesus is the Lord
///////////////////////
const { broadcast, listUnspent } = require("scrypt-ts/dist/providers/mProviders");
///////////////////////
///////////////////////

/////////////////////////////
//Jesus is the Lord
//  and the Giver of All Solutions
/////////////////////////////
//const scryptlib_1 = require("scryptlib");	//acrescetar
let dummyTx 

let dummyChangeOutput = 0
let dummyPrevOuts = ''

let dummyTXFlag = false
/////////////////////////////
/////////////////////////////



//Jesus is the Lord
//const FeeKB2023 = 1

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
class SmartContract {
    /** @ignore */
    static compileImpl(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpDir = fs.mkdtempSync((0, path_1.join)((0, os_1.tmpdir)(), "scrypt-ts-"));
            const result = yield (0, scryptlib_1.compileContractAsync)(filePath, {
                sourceMap: true,
                artifact: true,
                out: tmpDir
            });
            if (result.errors.length > 0) {
                throw new Error(`Compilation failed for class \`${this.name}\`. Check the output details at project building time!`);
            }
            else {
                const artifactFileName = (0, path_1.basename)(filePath).replace('.scrypt', '.json');
                const artifactFile = fs.readdirSync(tmpDir).filter(fn => fn == artifactFileName)[0];
                if (artifactFile) {
                    fs.copyFileSync((0, path_1.join)(tmpDir, artifactFile), (0, path_1.join)((0, path_1.dirname)(filePath), artifactFile));
                }
            }
            return result;
        });
    }
    /**
     * compiling the scrypt source which is the output of transpiling. Calling this function to output the contract artifact file.
     * only used for testing.
     * This function should not be called in production environment.
     * @returns {Artifact} if compiling succeed, otherwise it throws error.
     */
    static compile() {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield this.getTranspileErrors();
            if (Array.isArray(errors)) {
                if (errors[0]) {
                    throw errors[0];
                }
            }
            let artifact = this._loadCachedArtifact();
            if (artifact) {
                this.DelegateClazz = (0, scryptlib_1.buildContractClass)(artifact);
            }
            else {
                let filePath = this._getScryptFilePath();
                const result = yield this.compileImpl(filePath);
                this.DelegateClazz = (0, scryptlib_1.buildContractClass)(result);
                artifact = result.toArtifact();
            }
            return artifact;
        });
    }
    /** @ignore */
    static getTranspileErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_3.isInNodeEnv)()) {
                throw new Error(`the 'getTranspileErrors()' method should only be called in Node.js environment!`);
            }
            const transformationResult = this._getTransformationResult();
            if (!transformationResult.success) {
                // do not try to run compile if has errors during transpiling
                return transformationResult.errors;
            }
            return [];
        });
    }
    /**
     * This function is usually called on the frontend.
     * The contract class needs to call this function before instantiating.
     * @param artifactFile a merged contract artifact object, or its file path
     */
    static loadArtifact(artifactFile = undefined) {
        let artifact = undefined;
        if (typeof artifactFile === 'undefined') {
            artifact = this._loadCachedArtifact();
        }
        else if (typeof artifactFile === 'string') {
            artifact = this._loadArtifact(artifactFile);
        }
        else {
            artifact = artifactFile;
        }
        if (artifact === undefined) {
            throw new Error(`Cannot find the artifact file for contract \`${this.name}\`, run \`npx scrypt-cli@latest compile\` to generate it.`);
        }
        this.DelegateClazz = (0, scryptlib_1.buildContractClass)(artifact);
    }
    /**
     *
     * The contract class needs to call this function before instantiating.
     * @param artifact a merged contract artifact object
     */
    static getArtifact() {
        if (!this.DelegateClazz) {
            throw new Error(`No artifact found, Please compile the contract first.`);
        }
        return this.DelegateClazz.artifact;
    }
    /** @ignore */
    static _getTransformationResult() {
        // load from file
        const scryptFilePath = this._getScryptFilePath();
        const transResultFilePath = (0, utils_2.alterFileExt)(scryptFilePath, "transformer.json"); //scryptFilePath.replace(/\.scrypt$/, ".transformer.json");
        return JSON.parse(fs.readFileSync(transResultFilePath).toString());
    }
    /** @ignore */
    static _getScryptFilePath() {
        const scryptFilePath = Reflect.getMetadata("scrypt:filepath", this);
        // just return if meta data exists
        if (scryptFilePath)
            return scryptFilePath;
        // find indexer file of the contract
        let indexFile = (0, path_1.join)('.', indexerReader_1.INDEX_FILE_NAME);
        if (!fs.existsSync(indexFile)) {
            throw new Error(`Cannot find \`scrypt.index.json\` file, run \`npx scrypt-cli@latest compile\` to generate it.`);
        }
        // find scrypt file path in the indexer
        let indexer = new indexerReader_1.IndexerReader(indexFile);
        let filePath = indexer.getFullPath(this.name);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Cannot find the bundled scrypt file for contract \`${this.name}\`, run \`npx scrypt-cli@latest compile\` to generate it.`);
        }
        // set meta data
        Reflect.defineMetadata("scrypt:filepath", filePath, this);
        return filePath;
    }
    /** @ignore */
    static _loadCachedArtifact() {
        const scryptFile = this._getScryptFilePath();
        const artifactFile = (0, utils_2.alterFileExt)(scryptFile, 'json');
        return this._loadArtifact(artifactFile);
    }
    /** @ignore */
    static _loadArtifact(artifactFile) {
        if (!fs.existsSync(artifactFile)) {
            return undefined;
        }
        return JSON.parse(fs.readFileSync(artifactFile, 'utf8').toString());
    }
    /** @ignore */
    getDelegateClazz() {
        var _a;
        return (_a = Object.getOwnPropertyDescriptor(this.constructor, 'DelegateClazz')) === null || _a === void 0 ? void 0 : _a.value;
    }
    constructor(...args) {
        /** @ignore */
        this.enableUpdateEMC = false; // a flag indicateing whether can update `this.entryMethodCall`
        /** @ignore */
        this._txBuilders = new Map();
        const baseClass = Object.getPrototypeOf(this.constructor).name;
        /**
         * When a derived subclass is instantiated, the `super()` call may lack parameters required to initialize delegateInstance.
         * In this case, you need to ensure that `super()` does not throw an exception.
         * constructor(x: bigint, y: bigint) {
         *   super(1n*3n); // super(1n);
         *   this.setConstructor(...arguments)
         *   this.y = y;
         * }
         */
        if (baseClass === 'SmartContract') {
            this._initDelegateInstance(...args);
        }
        else {
            try {
                this._initDelegateInstance(...args);
            }
            catch (error) {
            }
        }
    }
    _initDelegateInstance(...args) {
        const DelegateClazz = this.getDelegateClazz();
        if (!DelegateClazz) {
            (0, error_1.throwUnInitializing)(this.constructor.name);
        }
        const args_ = args.map((arg, index) => {
            if (arg instanceof library_1.SmartContractLib) {
                return arg.getArgs();
            }
            if (arg instanceof types_1.HashedMap || arg instanceof types_1.HashedSet) {
                const ctorAbi = DelegateClazz.abi.find(abi => abi.type === scryptlib_1.ABIEntityType.CONSTRUCTOR);
                const type = ctorAbi.params[index].type;
                arg.attachTo(type, DelegateClazz);
                return arg;
            }
            return arg;
        });
        this.delegateInstance = new DelegateClazz(...args_);
        this.delegateInstance.isGenesis = false;
    }
    /**
     * Only inherited classes can call this function.
     * Direct subclasses of `SmartContract` do not need to call this function.
     * @param args  constructor parameters of inherited classes
     * @onchain
     */
    init(...args) {
        this._initDelegateInstance(...args);
    }
    /**
     * Execute the contract
     * @ignore
     * @deprecated
     */
    verify(entryMethodInvoking) {
        // Reset OP_CODESEPARATOR counter.
        this._csNum = 0;
        if (!(0, utils_3.isInNodeEnv)()) {
            console.error(`the 'verify' method should only be called in Node.js environment!`);
            return undefined;
        }
        let scryptFile = Object.getPrototypeOf(this).constructor._getScryptFilePath();
        const sourceMapFile = scryptFile.replace(/\.scrypt$/, '.scrypt.map');
        if (!fs.existsSync(sourceMapFile)) {
            throw new Error(`cannot find the bundled sourcemap file for \`${typeof this}\` at ${sourceMapFile}`);
        }
        let sourceMap = JSON.parse(fs.readFileSync(sourceMapFile).toString());
        let txContext = {};
        if (this.to) {
            txContext.tx = this.to.tx;
            let inputIndex = this.to.inputIndex;
            txContext.inputIndex = inputIndex;
            txContext.inputSatoshis = this.to.tx.inputs[inputIndex].output.satoshis;
        }
        try {
            const verifyEntryCall = ((ec) => {
                const result = ec.verify(txContext);
                if (!result.success && result.error) {
                    const matches = /\[(.+?)\]\((.+?)#(\d+)\)/.exec(result.error);
                    result.error.substring(0, matches.index);
                    const line = parseInt(matches[3]);
                    const tsLine = sourceMap[line - 1][0][2] + 1;
                    result.error = `[Go to Source](file://${scryptFile}:${tsLine})`;
                }
                return result;
            }).bind(this);
            let entryCall = this.buildEntryMethodCall(entryMethodInvoking);
            if (entryCall instanceof Promise) {
                return entryCall.then(v => verifyEntryCall(v));
            }
            else {
                return verifyEntryCall(entryCall);
            }
        }
        catch (error) {
            throw error; // make error throwing from `verify`
        }
    }
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
    getUnlockingScript(callPub) {
        try {
            let r = this.clone().buildEntryMethodCall(callPub);
            if (r instanceof Promise) {
                return r.then(v => v.unlockingScript);
            }
            else {
                return r.unlockingScript;
            }
        }
        catch (error) {
            throw error; // make error throwing from `getUnlockingScript`
        }
    }
    /**
     * sync properties values to delegateInstance iff it's not the genesis.
     * @ignore
     */
    syncStateProps() {
        if (!this.delegateInstance.isGenesis) {
            const statePropKeys = Reflect.getMetadata("scrypt:stateProps", this) || [];
            statePropKeys.forEach(statePropKey => {
                if (this[statePropKey] instanceof library_1.SmartContractLib) {
                    this.delegateInstance[statePropKey] = this[statePropKey].getState();
                }
                else if (this[statePropKey] instanceof types_1.HashedMap) {
                    this.delegateInstance[statePropKey] = this[statePropKey];
                }
                else if (this[statePropKey] instanceof types_1.HashedSet) {
                    this.delegateInstance[statePropKey] = this[statePropKey];
                }
                else {
                    this.delegateInstance[statePropKey] = this[statePropKey];
                }
            });
        }
    }
    /**
     * Returns a lockingScript of contract.
     */
    get lockingScript() {
        this.syncStateProps();
        return this.delegateInstance.lockingScript;
    }
    /**
     * Returns script size of lockingScript.
     */
    get scriptSize() {
        this.syncStateProps();
        return this.delegateInstance.lockingScript.toBuffer().length;
    }
    /**
     * Returns code part of the lockingScript, in hex format.
     */
    get codePart() {
        return this.delegateInstance.codePart.toHex();
    }
    /**
     * Returns sha256 hash of the current locking script, formatted as a LE hex string.
     */
    get scriptHash() {
        const res = (0, scryptlib_1.sha256)(this.lockingScript.toHex()).match(/.{2}/g);
        return res.reverse().join('');
    }
    /**
     * If the compiled contract contains any ASM variable templates (e.g. P2PKH.unlock.pubKeyHash),
     * replace them with the passed values.
     * @param {AsmVarValues} asmVarValues type that contains the actual values.
     * @returns {void}
     */
    setAsmVars(asmVarValues) {
        this.delegateInstance.replaceAsmVars(asmVarValues);
    }
    /**
     * Returns set ASM variable values.
     */
    get asmArgs() {
        return this.delegateInstance.asmArgs;
    }
    /**
     * Deep clone the contract instance.
     * @ignore
     * @param opt properties that only references are copied, but not deep clone their values.
     * @returns a cloned contract instance
     */
    clone(opt) {
        this.syncStateProps();
        // refCloneProps are properties that only references are copied, but not deep clone their values.
        const refClonePropNames = ['from', 'to', '_signer', '_provider'].concat((opt === null || opt === void 0 ? void 0 : opt.refCloneProps) || []);
        const refClonePropValues = refClonePropNames.map(pn => this[pn]);
        // shadow property references on this before cloning
        refClonePropNames.forEach(pn => this[pn] = undefined);
        const obj = (0, lodash_1.cloneDeep)(this);
        // copy property references to the object
        refClonePropNames.forEach((pn, idx) => obj[pn] = refClonePropValues[idx]);
        // recover property references on this
        refClonePropNames.forEach((pn, idx) => this[pn] = refClonePropValues[idx]);
        return obj;
    }
    /**
     *
     * @param opt properties that only references are copied, but not deep clone their values.
     * @returns a cloned contract instance with `this.from = undefined` and `this.to = undefined`
     */
    next(opt) {
        const cloned = this.clone(opt);
        cloned.from = undefined;
        cloned.to = undefined;
        cloned.delegateInstance.isGenesis = false;
        cloned.prependNOPScript(null);
        return cloned;
    }
    /**
     * Mark the contract as genesis contracts
     */
    markAsGenesis() {
        this.delegateInstance.isGenesis = true;
        return this;
    }
    /**
     * A built-in function to create an output containing the new state. It takes an input: the number of satoshis in the output.
     * @onchain
     * @param amount the number of satoshis in the output
     * @returns an output containing the new state
     */
    buildStateOutput(amount) {
        let outputScript = this.getStateScript();
        return functions_1.Utils.buildOutput(outputScript, amount);
    }
    /**
     * A built-in function to create an [change output]{@link https://wiki.bitcoinsv.io/index.php/Change}.
     * @onchain
     * @returns
     */
    buildChangeOutput() {

        ////////////////////////////////
        // Jesus is the Lord
        ////////////////////////////////
        console.log('DummyFlag 3: ', dummyTXFlag)
        if(dummyTXFlag)
        {
            const changeScript = functions_1.Utils.buildPublicKeyHashScript(this.changeAddress);
            console.log("buildOutput: ", functions_1.Utils.buildOutput(changeScript, BigInt(dummyChangeOutput)))
            return functions_1.Utils.buildOutput(changeScript, BigInt(dummyChangeOutput));
        }
        ////////////////////////////////
        ////////////////////////////////
        
        if (this.changeAmount > BigInt(0)) {
            const changeScript = functions_1.Utils.buildPublicKeyHashScript(this.changeAddress);
            return functions_1.Utils.buildOutput(changeScript, this.changeAmount);
        }
        return (0, types_1.toByteString)("");
    }
    /**
     * A built-in function to create a locking script containing the new state.
     * @onchain
     * @returns a locking script that containing the new state
     */
    getStateScript() {
        let sBuf = functions_1.VarIntWriter.writeBool(false);
        this.delegateInstance.stateProps
            .forEach(p => {
            let value = this[p.name];
            if (value instanceof types_1.HashedMap || value instanceof types_1.HashedSet) {
                value = {
                    _data: value.data()
                };
            }
            (0, scryptlib_1.flatternArg)(Object.assign({}, p, {
                value: value
            }), this.delegateInstance.resolver, {
                state: true,
                ignoreValue: false
            }).forEach(p => {
                if (['bytes', 'PubKey', 'Ripemd160', 'Sig', 'Sha1', 'SigHashPreimage', 'Sha256', 'SigHashType', 'OpCodeType'].includes(p.type)) {
                    sBuf += functions_1.VarIntWriter.writeBytes(p.value);
                }
                else if (p.type === 'int' || p.type === 'PrivKey') {
                    sBuf += functions_1.VarIntWriter.writeInt(p.value);
                }
                else if (p.type === 'bool') {
                    sBuf += functions_1.VarIntWriter.writeBool(p.value);
                }
            });
        });
        return this.codePart + functions_1.VarIntWriter.serializeState(sBuf);
    }
    /**
     * A built-in function verifies an ECDSA signature. It takes two inputs from the stack, a public key (on top of the stack) and an ECDSA signature in its DER_CANONISED format concatenated with sighash flags. It outputs true or false on the stack based on whether the signature check passes or fails.
     * @onchain
     * @category Signature Verification
     * @see https://wiki.bitcoinsv.io/index.php/Opcodes_used_in_Bitcoin_Script
     */
    checkSig(signature, publickey, errorMsg = "signature check failed") {
        if (!this.checkSignatureEncoding(signature) || !this.checkPubkeyEncoding(publickey)) {
            return false;
        }
        let fSuccess = false;
        this._assertToExist();
        const bufSig = Buffer.from(signature, 'hex');
        const bufPubkey = Buffer.from((0, types_1.toByteString)(publickey), 'hex');
        try {
            const sig = scryptlib_1.bsv.crypto.Signature.fromTxFormat(bufSig);
            console.log('Sig: ', scryptlib_1.toHex(sig))
            const pubkey = scryptlib_1.bsv.PublicKey.fromBuffer(bufPubkey, false);
            console.log('pubkey: ', scryptlib_1.toHex(pubkey))
            const tx = this.to.tx;
            const inputIndex = this.to.inputIndex || 0;
            console.log('inputIndex: ', inputIndex)
            const inputSatoshis = this.to.tx.inputs[inputIndex].output.satoshis;
            console.log('inputSatoshis: ', inputSatoshis)
 
            // Cut script until most recent OP_CS.
            const subScript = this.delegateInstance.lockingScript.subScript(this._csNum - 1);
            console.log('this._csNum: ', this._csNum)

            
            //console.log('TX final: ', scryptlib_1.toHex(tx).substring(scryptlib_1.toHex(tx).length - 200))
            //console.log('TX Total: ', scryptlib_1.toHex(tx))

            fSuccess = tx.verifySignature(sig, pubkey, inputIndex, subScript, scryptlib_1.bsv.crypto.BN.fromNumber(inputSatoshis), scryptlib_1.DEFAULT_FLAGS);
            console.log('Success Signture Before: ', fSuccess)
        }
        catch (e) {
            // invalid sig or pubkey
            fSuccess = false;
        }

        //console.log('Success Signture: ', fSuccess)
        //console.log('bufSig.length: ', bufSig.length)
        
        
        if (!fSuccess && bufSig.length) {
            // because NULLFAIL rule, always throw if catch a wrong signature 
            // https://github.com/bitcoin/bips/blob/master/bip-0146.mediawiki#nullfail
            throw new Error(errorMsg);
        }
        return fSuccess;
    }
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
    checkPreimageAdvanced(txPreimage, privKey, pubKey, inverseK, r, rBigEndian, sigHashType) {
        // hash is big endian
        let h = (0, functions_1.hash256)((0, types_1.toByteString)(txPreimage));
        let sig = functions_1.Tx.sign(functions_1.Tx.fromBEUnsigned(h), privKey, inverseK, r, rBigEndian, sigHashType);
        return this.checkSig(sig, pubKey);
    }
    /**
     * Same as `checkPreimage`, but support customized sighash type
     * @onchain
     * @param txPreimage The format of the preimage is [specified]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}
     * @param sigHashType A SIGHASH flag is used to indicate which part of the transaction is signed by the ECDSA signature.
     * @returns true if `txPreimage` is the preimage of the current transaction. Otherwise false.
     */
    checkPreimageSigHashType(txPreimage, sigHashType) {
        return this.checkPreimageAdvanced(txPreimage, functions_1.Tx.privKey, functions_1.Tx.pubKey, functions_1.Tx.invK, functions_1.Tx.r, functions_1.Tx.rBigEndian, sigHashType);
    }
    /**
     * Using the [OP_PUSH_TX]{@link https://medium.com/@xiaohuiliu/op-push-tx-3d3d279174c1} technique, check if `txPreimage` is the preimage of the current transaction.
     * @onchain
     * @param txPreimage The format of the preimage is [specified]{@link https://github.com/bitcoin-sv/bitcoin-sv/blob/master/doc/abc/replay-protected-sighash.md#digest-algorithm}
     * @returns true if `txPreimage` is the preimage of the current transaction. Otherwise false.
     */
    checkPreimage(txPreimage) {
        return this.checkPreimageAdvanced(txPreimage, functions_1.Tx.privKey, functions_1.Tx.pubKey, functions_1.Tx.invK, functions_1.Tx.r, functions_1.Tx.rBigEndian, functions_1.SigHash.ALL);
    }
    /**
     * Insert and OP_CODESEPARATOR at this point of the functions logic.
     * More detail about [OP_CODESEPARATOR]{@link https://wiki.bitcoinsv.io/index.php/OP_CODESEPARATOR}
     */
    insertCodeSeparator() {
        // Call transpiled to "***" in native sCrypt. See transpiler.ts.
        this._csNum++;
        return;
    }
    /**
     * Compares the first signature against each public key until it finds an ECDSA match. Starting with the subsequent public key, it compares the second signature against each remaining public key until it finds an ECDSA match. The process is repeated until all signatures have been checked or not enough public keys remain to produce a successful result. All signatures need to match a public key. Because public keys are not checked again if they fail any signature comparison, signatures must be placed in the scriptSig using the same order as their corresponding public keys were placed in the scriptPubKey or redeemScript. If all signatures are valid, 1 is returned, 0 otherwise. Due to a bug, one extra unused value is removed from the stack.
     * @onchain
     * @category Signature Verification
     * @see https://wiki.bitcoinsv.io/index.php/Opcodes_used_in_Bitcoin_Script
     */
    checkMultiSig(signatures, publickeys) {
        for (let i = 0; i < signatures.length; i++) {
            if (!this.checkSignatureEncoding(signatures[i])) {
                return false;
            }
        }
        for (let i = 0; i < publickeys.length; i++) {
            if (!this.checkPubkeyEncoding(publickeys[i])) {
                return false;
            }
        }
        this._assertToExist();
        const tx = this.to.tx;
        const inputIndex = this.to.inputIndex || 0;
        const inputSatoshis = this.to.tx.inputs[inputIndex].output.satoshis;
        let pubKeysVisited = new Set();
        for (let i = 0; i < signatures.length; i++) {
            const sig = scryptlib_1.bsv.crypto.Signature.fromTxFormat(Buffer.from((0, types_1.toByteString)(signatures[i]), 'hex'));
            let noPubKeyMatch = true;
            for (let j = 0; j < publickeys.length; j++) {
                if (pubKeysVisited.has(j)) {
                    continue;
                }
                pubKeysVisited.add(j);
                const pubkey = scryptlib_1.bsv.PublicKey.fromBuffer(Buffer.from((0, types_1.toByteString)(publickeys[j]), 'hex'), false);
                // Cut script until most recent OP_CS.
                const subScript = this.delegateInstance.lockingScript.subScript(this._csNum - 1);
                try {
                    let success = tx.verifySignature(sig, pubkey, inputIndex, subScript, scryptlib_1.bsv.crypto.BN.fromNumber(inputSatoshis), scryptlib_1.DEFAULT_FLAGS);
                    if (success) {
                        noPubKeyMatch = false;
                        break;
                    }
                }
                catch (e) {
                    continue;
                }
            }
            if (noPubKeyMatch) {
                return false;
            }
        }
        return true;
    }
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
    timeLock(locktime) {
        let res = true;
        // Ensure nSequence is less than UINT_MAX.
        res = this.ctx.sequence < 0xffffffff;
        // Check if using block height.
        if (locktime < 500000000) {
            // Enforce nLocktime field to also use block height.
            res = res && this.ctx.locktime < 500000000;
        }
        return res && this.ctx.locktime >= locktime;
    }
    /**
     * Get the amount of the change output for `to.tx`.
     * @onchain
     * @returns amount in satoshis
     */
    get changeAmount() {
        this._assertToExist();
        return BigInt(this.to.tx.getChangeAmount());
    }
    /**
   * Get the prevouts for `to.tx`.
   * @onchain
   * @returns prevouts in satoshis
   */
    get prevouts() {

        this._assertToExist();
        const sighashType = this.sigTypeOfMethod(this._currentMethod);
        if (sighashType & scryptlib_1.bsv.crypto.Signature.SIGHASH_ANYONECANPAY) {
            console.log('(0, types_1.toByteString)("")', (0, types_1.toByteString)(""))
            return (0, types_1.toByteString)("");
        }

        /*
        if(dummyTXFlag)
        {
            console.log('dummyPrevOuts: ', dummyPrevOuts)

            let prevOutDummy = ''

            let hexString = ''

            for(let i = 0; i < dummyTx.inputs.length; i++)
            {
                console.log('dummyTx.inputs[', i, '].prevTxId: ', scryptlib_1.toHex(dummyTx.inputs[i].prevTxId))

                hexString = scryptlib_1.toHex(dummyTx.inputs[i].prevTxId)
                let bytePairs = hexString.match(/.{1,2}/g);
                let reversedPairs = bytePairs.reverse();
                prevOutDummy = prevOutDummy + reversedPairs.join('');

                console.log('dummyTx.inputs[', i, '].outputIndex: ', dummyTx.inputs[i].outputIndex)
                let index = dummyTx.inputs[i].outputIndex.toString(8)
                while(index.length < 16)
                {
                    index = '0' + index
                }
                bytePairs = index.match(/.{1,2}/g);
                reversedPairs = bytePairs.reverse();
                prevOutDummy = prevOutDummy + reversedPairs.join('');

            }
            console.log('prevOutDummy: ', prevOutDummy)

            //return dummyPrevOuts
        }
        */

        console.log('this.to.tx.prevouts(): ', this.to.tx.prevouts())

        
        return this.to.tx.prevouts();
    }
    /**
     * Get the change address of the change output for `to.tx`.
     * @onchain
     * @returns the change address of to.tx
     */
    get changeAddress() {
        this._assertToExist();
        // TODO: update bsv index.d.ts later
        if (!this.to.tx["_changeAddress"]) {
            throw new Error('No change output found on the transaction');
        }
        return (0, scryptlib_1.PubKeyHash)(this.to.tx["_changeAddress"].toObject().hash);
    }
    /**
     * @ignore
     * @param publickey
     * @returns true publickey valid.
     */
    checkPubkeyEncoding(publickey) {
        if ((scryptlib_1.DEFAULT_FLAGS & scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0 && !scryptlib_1.bsv.PublicKey.isValid((0, types_1.toByteString)(publickey))) {
            return false;
        }
        return true;
    }
    /**
     * @ignore
     * @param signature
     * @returns true signature valid.
     */
    checkSignatureEncoding(signature) {
        var buf = Buffer.from((0, types_1.toByteString)(signature), 'hex');
        var sig;
        // Empty signature. Not strictly DER encoded, but allowed to provide a
        // compact way to provide an invalid signature for use with CHECK(MULTI)SIG
        if (buf.length === 0) {
            return true;
        }
        if ((scryptlib_1.DEFAULT_FLAGS & (scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_DERSIG | scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_LOW_S | scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_STRICTENC)) !== 0 && !scryptlib_1.bsv.crypto.Signature.isTxDER(buf)) {
            return false;
        }
        else if ((scryptlib_1.DEFAULT_FLAGS & scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_LOW_S) !== 0) {
            sig = scryptlib_1.bsv.crypto.Signature.fromTxFormat(buf);
            if (!sig.hasLowS()) {
                return false;
            }
        }
        else if ((scryptlib_1.DEFAULT_FLAGS & scryptlib_1.bsv.Script.Interpreter.SCRIPT_VERIFY_STRICTENC) !== 0) {
            sig = scryptlib_1.bsv.crypto.Signature.fromTxFormat(buf);
            if (!sig.hasDefinedHashtype()) {
                return false;
            }
            if (!(scryptlib_1.DEFAULT_FLAGS & scryptlib_1.bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID) &&
                (sig.nhashtype & scryptlib_1.bsv.crypto.Signature.SIGHASH_FORKID)) {
                return false;
            }
            if ((scryptlib_1.DEFAULT_FLAGS & scryptlib_1.bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID) &&
                !(sig.nhashtype & scryptlib_1.bsv.crypto.Signature.SIGHASH_FORKID)) {
                return false;
            }
        }
        return true;
    }
    hasPrevouts(methodName) {
        const abi = this.getDelegateClazz().abi.find(func => func.name === methodName);
        // only entry (public) method calls will be delegated to the target instance.
        if (!abi) {
            throw new Error(`contract ${this.constructor.name} doesnot have method ${methodName}`);
        }
        return abi.params.findIndex(param => param.name === "__scrypt_ts_prevouts" && param.type === "bytes") > -1;
    }
    /**
     * call delegateInstance method
     * @ignore
     * @param methodName
     * @param args
     * @returns
     */
    callDelegatedMethod(methodName, ...args) {
        const abi = this.getDelegateClazz().abi.find(func => func.name === methodName);
        // only entry (public) method calls will be delegated to the target instance.
        if (!abi)
            return undefined;
        this._currentMethod = methodName;
        // explicit params are from the definition of @method
        const explicitParams = abi.params.slice(0, args.length);
        // find all params that are hidden from ts @method, which should be auto filled with proper values here.
        const autoFillParams = abi.params.slice(args.length);
        let autoFillArgBindings = new Map();
        let txPreimage;
        let prevouts;
        const accessPathArgCallbacks = new Map();
        autoFillParams.forEach((param, idx) => {
            // auto fill `__scrypt_ts_txPreimage`
            if (param.name === "__scrypt_ts_txPreimage" && param.type === "SigHashPreimage") {
                this._assertToExist();
                const sighash = this.sigTypeOfMethod(methodName);
                // this preiamge maybe a cached preimage
                txPreimage = (0, types_1.SigHashPreimage)(this.to.tx.getPreimage(this.to.inputIndex, sighash));
       
                autoFillArgBindings.set(param.name, txPreimage);
            }
            // auto fill `__scrypt_ts_changeAmount`
            if (param.name === "__scrypt_ts_changeAmount" && param.type === "int") {

                //autoFillArgBindings.set(param.name, this.changeAmount);

                //////////////////////////////////////////////////
                // Jesus is The LORD!!!
                //////////////////////////////////////////////////
                console.log('Dummy Flag 4 delegate: ', dummyTXFlag)

                if(dummyTXFlag)
                {
                    autoFillArgBindings.set(param.name, BigInt(dummyChangeOutput));
                    console.log('Entrou em Dummy: ', BigInt(dummyChangeOutput))
                }
                else
                {
                    autoFillArgBindings.set(param.name, this.changeAmount);
                }
                //////////////////////////////////////////////////
                //////////////////////////////////////////////////               
  
            }
            // auto fill `__scrypt_ts_changeAddress`
            if (param.name === "__scrypt_ts_changeAddress" && param.type === "Ripemd160") {
                autoFillArgBindings.set(param.name, this.changeAddress);
            }
            // auto fill `__scrypt_ts_accessPathForProp__${propName}`
            if (param.name.startsWith("__scrypt_ts_accessPathForProp__") && param.type === "bytes") {
                const propName = param.name.replace("__scrypt_ts_accessPathForProp__", "");
                // traceable object is a HashedMap/HashedSet-typed contract property.
                let traceableObj = this[propName];
                if (!(0, types_1.instanceOfSIATraceable)(traceableObj)) {
                    throw new Error(`Internel error: traceable object \`${propName}\` not found`);
                }
                // start tracing SortedItem access on the traceable object
                traceableObj.startTracing();
                // get index of the param in the whole parameters
                const argIdx = explicitParams.length + idx;
                // setup a callback function, it will will be evaluated after @method execution
                accessPathArgCallbacks.set(argIdx, () => {
                    // stop trace
                    traceableObj.stopTracing();
                    return traceableObj.serializedAccessPath();
                });
                // set a dummy value as a placeholder for the access path param
                // if real accesses count > 10, getEstimateFee will fail when auto pay fee
                autoFillArgBindings.set(param.name, (0, crypto_1.randomBytes)(2 /* bytes per access */ * 10 /* estimated accesses */).toString('hex'));
            }
            // auto fill `__scrypt_ts_prev`
            if (param.name === "__scrypt_ts_prevouts" && param.type === "bytes") {
                prevouts = this.prevouts;
                autoFillArgBindings.set(param.name, prevouts);
            }
        });
        args.push(...autoFillParams.map(p => {
            const val = autoFillArgBindings.get(p.name);
            if (val === undefined) {
                throw new Error(`missing auto-filled value for argument ${p.name}`);
            }
            return val;
        }));

        return {
            publicMethodCall: this.encodeMethodCall(methodName, args),
            txPreimage,
            prevouts,
            traceableArgCallbacks: accessPathArgCallbacks,
            abi
        };
    }
    /**
     * Call the public function on the delegateInstance
     * @ignore
     * @param methodName
     * @param args
     * @returns a `FunctionCall` that contains a unlocking script
     */
    encodeMethodCall(methodName, args) {
        return this.getDelegateClazz().prototype[methodName].call(this.delegateInstance, ...args);
    }
    /**
     * Set `this.ctx` by a `SigHashPreimage`
     * @ignore
     * @param txPreimage
     */
    setCtx(txPreimage) {
        const outpoint = functions_1.SigHash.outpoint(txPreimage);
        this._ctx = {
            version: functions_1.SigHash.nVersion(txPreimage),
            utxo: {
                value: functions_1.SigHash.value(txPreimage),
                script: functions_1.SigHash.scriptCode(txPreimage),
                outpoint: {
                    txid: outpoint.slice(0, 32 * 2),
                    outputIndex: functions_1.Utils.fromLEUnsigned(outpoint.slice(32 * 2))
                }
            },
            hashPrevouts: functions_1.SigHash.hashPrevouts(txPreimage),
            hashSequence: functions_1.SigHash.hashSequence(txPreimage),
            sequence: functions_1.SigHash.nSequence(txPreimage),
            hashOutputs: functions_1.SigHash.hashOutputs(txPreimage),
            locktime: functions_1.SigHash.nLocktime(txPreimage),
            sigHashType: functions_1.SigHash.sigHashType(txPreimage),
            serialize() { return txPreimage; },
        };
    }
    /** @ignore */
    clearCtx() {
        this._ctx = undefined;
    }
    /**
     * set the data part of the contract in ASM format
     * @param dataPart
     */
    setDataPartInASM(dataPart) {
        this.delegateInstance.setDataPartInASM(dataPart);
    }
    /**
     * set the data part of the contract in hex format
     * @param dataPart
     */
    setDataPartInHex(dataPart) {
        this.delegateInstance.setDataPartInHex(dataPart);
    }
    get dataPart() {
        return this.delegateInstance.dataPart;
    }
    /** @ignore */
    buildEntryMethodCall(callPub) {
        this.entryMethodCall = undefined;
        this.enableUpdateEMC = true;
        const afterCall = (() => {
            if (!this.entryMethodCall) {
                throw new Error('a contract public method should be called on the `self` parameter within the `callPub` function');
            }
            const entryCall = this.entryMethodCall;
            this.entryMethodCall = undefined;
            this.enableUpdateEMC = false;
            return entryCall;
        }).bind(this);
        // `this.entryMethodCall` should be set properly in call back: `callPub`
        const callPubRet = callPub(this);
        if (callPubRet instanceof Promise) {
            return callPubRet.then(() => afterCall());
        }
        else {
            return afterCall();
        }
    }
    /** @ignore */
    _assertToExist() {
        if (!this.to) {
            throw new Error('`this.to` is undefined, it should be set properly before calling the method');
        }
    }
    /** @ignore */
    _assertFromExist() {
        if (!this.from) {
            throw new Error('`this.from` is undefined, it should be set properly before calling the method');
        }
    }
    /**
     * connect a provider or a signer.
     * @param providerOrSigner a provider or a signer
     */
    connect(providerOrSigner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (abstract_signer_1.Signer.isSigner(providerOrSigner)) {
                this._signer = providerOrSigner;
                this._provider = providerOrSigner.provider;
                yield this._signer.connect(this._provider);
            }
            else if (abstract_provider_1.Provider.isProvider(providerOrSigner)) {
                this._provider = providerOrSigner;
                yield this._provider.connect();
            }
            else {
                throw new Error('invalid argument `providerOrSigner`');
            }
        });
    }
    /**
     * Get the connected [signer]{@link https://docs.scrypt.io/how-to-test-a-contract#signer}
     */
    get signer() {
        if (!this._signer) {
            throw new Error('signer has not been connected yet! call `contract.connect(signer)`');
        }
        return this._signer;
    }
    /**
     * Get the connected [provider]{@link https://docs.scrypt.io/how-to-test-a-contract#provider}
     */
    get provider() {
        if (!this._provider) {
            throw new Error('provider has not been connected yet! call `contract.connect(providerOrSigner)`');
        }
        return this._provider;
    }
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
    buildDeployTransaction(utxos, amount, changeAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployTx = new scryptlib_1.bsv.Transaction().from(utxos)
                .addOutput(new scryptlib_1.bsv.Transaction.Output({
                script: this.lockingScript,
                satoshis: amount,
            }));
            deployTx.change(changeAddress);
            if (this._provider) {
                deployTx.feePerKb(yield this.provider.getFeePerKb());
                //deployTx.feePerKb(FeeKB2023);
            }
            return deployTx;
        });
    }
    /**
     * Deploy the contract
     * @param amount satoshis locked in the contract, 1 sat by default
     * @param options An optional parameter that can specify the change address
     * @returns The transaction id of the successfully deployed contract
     */
    deploy(amount = 1, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.markAsGenesis();
            /**
             * Use a dummy transaction to estimate fee.
             * Add two p2pkh inputs trying to avoid re-fetching utxos if the request amount is not enough.
             */
            const changeAddress = (options === null || options === void 0 ? void 0 : options.changeAddress) || (yield this.signer.getDefaultAddress());
            const tx = yield this.buildDeployTransaction([], amount, changeAddress);
            const address = (options === null || options === void 0 ? void 0 : options.address) || (yield this.signer.getDefaultAddress());
            const feePerKb = yield this.provider.getFeePerKb();
            //const feePerKb = FeeKB2023;
            yield SmartContract.autoPayfee(tx, feePerKb, this.signer, address);
            const signedTx = yield this.signer.signAndsendTransaction(tx, { address });
            this.from = { tx: signedTx, outputIndex: 0 };
            return signedTx;
        });
    }
    /** @ignore */
    _prepareArgsForMethodCall(methodName, ...args) {
        const scryptMethod = this.getDelegateClazz().abi.find(func => func.name === methodName);
        if (!scryptMethod) {
            throw new Error(`\`${this.constructor.name}.${methodName}\` no exists!`);
        }
        const methodParamLength = this.getMethodsMeta(methodName).argLength;
        if (args.length != methodParamLength && args.length != methodParamLength + 1) {
            throw new Error(`argument count mismatch while calling \`this.methods.${methodName}\`. Expected ${methodParamLength} or ${methodParamLength + 1} (if passing \`MethodCallOptions\`), but got ${args.length}`);
        }
        const methodArgs = args.slice(0, methodParamLength);
        const maybeOptArg = args[methodParamLength];
        let methodCallOptions = {
            verify: false,
            partiallySigned: false,
            exec: true,
            autoPayFee: true,
            multiContractCall: false,
            next: [],
        };
        if (maybeOptArg) {
            // check options argument
            if (typeof maybeOptArg !== 'object') {
                throw new Error(`The last argument is expected to be an object of type \`MethodCallOptions\`. Got \`${typeof maybeOptArg}\' instead.`);
            }
            Object.assign(methodCallOptions, maybeOptArg);
        }
        let sigArgs = methodArgs.reduce((sigsMap, arg, argIdx) => {
            const scrParam = scryptMethod.params[argIdx];
            const match = scrParam.type.match(/^Sig(\[(\d+)\])?$/);
            const argType = typeof arg;
            if (match) {
                const sigLen = match[2] || '1';
                if (argType !== 'function') {
                    throw new Error(`a callback function of type \`(sigResponses: SignatureResponse[]) => Sig | Sig[] \` should be given for the Sig type argument`);
                }
                sigsMap.set(argIdx, { callback: arg, length: parseInt(sigLen) });
            }
            else {
                if (argType === 'function') {
                    throw new Error(`a callback function given for the non-Sig type argument is not allowed`);
                }
            }
            return sigsMap;
        }, new Map());
        return {
            methodArgs,
            methodCallOptions,
            sigArgs
        };
    }
    call(methodName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Reset OP_CODESEPARATOR counter.
            this._csNum = 0;
            const { methodArgs, methodCallOptions, sigArgs } = this._prepareArgsForMethodCall(methodName, ...args);
            if (methodCallOptions.multiContractCall === true) {
                return this.multiContractCall(methodName, methodCallOptions, methodArgs, sigArgs);
            }
            return this.singleContractCall(methodName, methodCallOptions, methodArgs, sigArgs);
        });
    }
    singleContractCall(methodName, methodCallOptions, methodArgs, sigArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.signer.getDefaultAddress();
            const feePerKb = yield this.provider.getFeePerKb();
            //const feePerKb = FeeKB2023;
            let txBuilder = this.getTxBuilder(methodName);
            if (!txBuilder) {
                throw new Error(`missing bound \`txBuilder\` for calling \`${methodName}\``);
            }
            // build a signed dummyTx to estimate fee
            const methodArgsWithDummySig = methodArgs.map((arg, argIdx) => {
                const sigArg = sigArgs.get(argIdx);
                if (sigArg) {
                    // replace sig-related args with dummy values
                    return sigArg.length > 1 ? new Array(sigArg.length).fill((0, utils_3.getDummySig)()) : (0, utils_3.getDummySig)();
                }
                else {
                    return arg;
                }
            });
            if (!methodCallOptions.fromUTXO && !this.from) {
                throw new Error(`param \`fromUTXO\` and \`this.from\` should not be both empty for calling \`this.buildContractInput\`!`);
            }
            if (methodCallOptions.fromUTXO) {
                this.from = methodCallOptions.fromUTXO;
            }
            const autoPayFee = methodCallOptions.autoPayFee === undefined || methodCallOptions.autoPayFee === true;
            let { tx, atInputIndex, nexts } = yield txBuilder.call(null, this, methodCallOptions, ...methodArgsWithDummySig);
            this.to = { tx, inputIndex: atInputIndex };
            // Add dummy data to input in order to get the fee estimate right.
            this.dummySignSingleCallTx(tx, atInputIndex, methodName, ...methodArgsWithDummySig);
            if (autoPayFee) {
                // Add fee inputs and adjust change out value.
                const hasPrevouts = this.hasPrevouts(methodName);
                yield SmartContract.autoPayfee(tx, feePerKb, this.signer, address, hasPrevouts ? 36 : 0);
                if (hasPrevouts) {
                    this.dummySignSingleCallTx(tx, atInputIndex, methodName, ...methodArgsWithDummySig);
                    // Only adjust change out value.
                    tx['_feePerKb'] = feePerKb;
                    Object.getPrototypeOf(tx)._updateChangeOutput.apply(tx);
                }
            }
            // re sign use real key.
            yield this.signSingleCallTx(tx, atInputIndex, address, methodCallOptions, methodName, methodArgs, sigArgs);
            // bind relations
            this.to = { tx, inputIndex: atInputIndex };
            if (nexts) {
                nexts.forEach(n => {
                    n.instance.from = { tx, outputIndex: n.atOutputIndex };
                });
            }
            if (!methodCallOptions.partiallySigned) {
                if (methodCallOptions.verify || process.env.NETWORK === 'local') {
                    const result = tx.verify();
                    if (typeof result === 'string') {
                        throw new Error(`Transaction verify failed: ${result}`);
                    }
                }
                yield this.provider.sendTransaction(tx);
            }
            return {
                tx,
                atInputIndex,
                nexts,
                next: Array.isArray(nexts) ? nexts[0] : undefined
            };
        });
    }
    multiContractCall(methodName, methodCallOptions, methodArgs, sigArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            let txBuilder = this.getTxBuilder(methodName);
            if (!txBuilder) {
                throw new Error(`missing bound \`txBuilder\` for calling \`${methodName}\``);
            }
            // build a signed dummyTx to estimate fee
            const methodArgsWithDummySig = methodArgs.map((arg, argIdx) => {
                const sigArg = sigArgs.get(argIdx);
                if (sigArg) {
                    // replace sig-related args with dummy values
                    return sigArg.length > 1 ? new Array(sigArg.length).fill((0, utils_3.getDummySig)()) : (0, utils_3.getDummySig)();
                }
                else {
                    return arg;
                }
            });
            if (!methodCallOptions.fromUTXO && !this.from) {
                throw new Error(`param \`fromUTXO\` and \`this.from\` should not be both empty for calling \`this.buildContractInput\`!`);
            }
            if (methodCallOptions.fromUTXO) {
                this.from = methodCallOptions.fromUTXO;
            }
            let { tx, atInputIndex, nexts } = yield txBuilder.call(null, this, methodCallOptions, ...methodArgsWithDummySig);
            // bind relations
            this.to = { tx, inputIndex: atInputIndex };
            if (nexts) {
                nexts.forEach(n => {
                    n.instance.from = { tx, outputIndex: n.atOutputIndex };
                });
            }
            if (Object.prototype.hasOwnProperty.call(tx, 'calllogs')) {
                tx['calllogs'].push({
                    instance: this,
                    methodArgs: methodArgs,
                    sigArgs: sigArgs,
                    atInputIndex: atInputIndex,
                    nexts: nexts,
                    pubKeyOrAddrToSign: methodCallOptions.pubKeyOrAddrToSign,
                    methodName: methodName,
                    exec: methodCallOptions.exec
                });
            }
            else {
                Object.defineProperty(tx, 'calllogs', {
                    value: [{
                            instance: this,
                            methodArgs: methodArgs,
                            sigArgs: sigArgs,
                            atInputIndex: atInputIndex,
                            nexts: nexts,
                            pubKeyOrAddrToSign: methodCallOptions.pubKeyOrAddrToSign,
                            methodName: methodName,
                            exec: methodCallOptions.exec
                        }],
                    writable: false
                });
            }
            return {
                tx,
                atInputIndex,
                nexts,
                next: Array.isArray(nexts) ? nexts[0] : undefined
            };
        });
    }
    signSingleCallTx(tx, inputIndex, defaultAddress, methodCallOptions, methodName, methodArgs, sigArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = this.provider.getNetwork();
            // Build sig requests for inputs of transaction.
            const sigRequests = tx.inputs.flatMap((input, idx) => {
                // If autoPayFee is false, then only sign contract call input.
                // Else, sign ALL inputs.
                if (!methodCallOptions.autoPayFee && idx !== inputIndex) {
                    return undefined;
                }
                if (idx === inputIndex) {
                    let sigOptions = methodCallOptions.pubKeyOrAddrToSign ? (0, utils_1.parseSignatureOption)(methodCallOptions.pubKeyOrAddrToSign, network) : [{
                            address: defaultAddress,
                            sigHashType: scryptlib_1.DEFAULT_SIGHASH_TYPE,
                            csIdx: undefined
                        }];
                    return sigOptions.map(item => {
                        return {
                            prevTxId: (0, scryptlib_1.toHex)(input.prevTxId),
                            outputIndex: input.outputIndex,
                            inputIndex: idx,
                            satoshis: input.output.satoshis,
                            scriptHex: input.output.script.toHex(),
                            address: item.address,
                            sigHashType: item.sigHashType,
                            csIdx: item.csIdx
                        };
                    });
                }
                else {
                    const address = input.output.script.isPublicKeyHashOut() ? scryptlib_1.bsv.Address.fromPublicKeyHash(input.output.script.getPublicKeyHash(), network)
                        : defaultAddress;
                    return {
                        prevTxId: (0, scryptlib_1.toHex)(input.prevTxId),
                        outputIndex: input.outputIndex,
                        inputIndex: idx,
                        satoshis: input.output.satoshis,
                        scriptHex: input.output.script.toHex(),
                        address,
                        sigHashType: scryptlib_1.DEFAULT_SIGHASH_TYPE,
                        csIdx: undefined
                    };
                }
            }).filter((val) => val !== undefined);
            const sigResponses = yield this.signer.getSignatures(tx.toString(), sigRequests);

            sigResponses
                // group by inputIndex
                .reduce((group, sigResp) => {
                const inputIdx = sigResp.inputIndex;
                const sigs = group.get(inputIdx) || [];
                sigs.push(sigResp);
                group.set(inputIdx, sigs);
                return group;
            }, new Map())
                // apply signatures
                .forEach((sigResponses, idx) => {
                if (idx === inputIndex) {
                    let methodArgs_ = methodArgs.map((arg, argIdx) => {
                        const sigArg = sigArgs.get(argIdx);
                        if (!sigArg) {
                            return arg;
                        }
                        const validateSig = (sig) => {
                            if (typeof sig !== 'string') {
                                throw new Error(`the ${argIdx + 1}th argument calback function should returns a valid \`Sig\``);
                            }
                        };
                        const sigs = sigArg.callback.call(this, sigResponses) || '';
                        if (sigs instanceof Array) {
                            if (sigs.length !== sigArg.length) {
                                throw new Error(`the ${argIdx + 1}th argument calback function should returns a valid \`Sig\` array whose length is expected to be ${sigArg.length}, but got ${sigs.length}`);
                            }
                            sigs.forEach(sig => validateSig(sig));
                        }
                        else {
                            validateSig(sigs);
                        }
                        return sigs;
                    });
                    if (methodCallOptions.exec) {
                        const script = this.getUnlockingScript(self => {
                            self[methodName](...methodArgs_);
                        });
                        tx.inputs[inputIndex].setScript(script);
                    }
                    else {
                        const { publicMethodCall } = this.callDelegatedMethod(methodName, ...methodArgs_);
                        tx.inputs[inputIndex].setScript(publicMethodCall.toScript());
                    }
                }
                else {
                    if (methodCallOptions.autoPayFee) {
                        sigResponses.forEach(sigResp => {
                            tx.applySignature({
                                inputIndex: sigResp.inputIndex,
                                sigtype: sigResp.sigHashType || scryptlib_1.DEFAULT_SIGHASH_TYPE,
                                publicKey: scryptlib_1.bsv.PublicKey.fromString(sigResp.publicKey),
                                signature: scryptlib_1.bsv.crypto.Signature.fromTxFormat(Buffer.from(sigResp.sig, 'hex'))
                            });
                        });
                    }
                }
            });
        });
    }
    dummySignSingleCallTx(tx, inputIndex, methodName, ...args) {
        tx.inputs.forEach((input, idx) => {
            if (idx === inputIndex) {
                const { publicMethodCall } = this.callDelegatedMethod(methodName, ...args);
                input.setScript(publicMethodCall.toScript());
            }
        });
    }
    /**
     * An object to access all public `@method`s
     */
    get methods() {
        const self = this;
        const scryptMethods = this.getDelegateClazz().abi.filter(func => func.type === 'function').map(func => func.name);
        return scryptMethods.reduce((ms, m) => {
            ms[m] = (...args) => self.call(m, ...args);
            return ms;
        }, {});
    }
    /** @ignore */
    getTxBuilder(methodName) {
        const scryptMethods = this.getDelegateClazz().abi.filter(func => func.type === 'function').map(func => func.name);
        if (!scryptMethods.includes(methodName)) {
            throw new Error(`\`${methodName}\` is not a @method and do not have any bounded \`txBuilder\``);
        }
        if (this._txBuilders.has(methodName)) {
            return this._txBuilders.get(methodName);
        }
        const fn = Object.getOwnPropertyNames(this.constructor)
            .filter(prop => typeof this.constructor[prop] === "function").find(fn => fn === `buildTxFor${(0, utils_2.camelCaseCapitalized)(methodName)}`);
        if (fn) {
            return this.constructor[fn];
        }
        return SmartContract.defaultCallTxBuilder(this.getMethodsMeta(methodName).sigHashType);
    }
    /**
     * Bind a transation builder for a public `@method`
     * @param methodName the public `@method` name
     * @param txBuilder a transation builder
     */
    bindTxBuilder(methodName, txBuilder) {
        if (!this.getDelegateClazz()) {
            (0, error_1.throwUnInitializing)(this.constructor.name);
        }
        const scryptMethods = this.getDelegateClazz().abi.filter(func => func.type === 'function').map(func => func.name);
        if (!scryptMethods.includes(methodName)) {
            throw new Error(`\`${methodName}\` is not a @method and cat not set bounded \`txBuilder\``);
        }
        this._txBuilders.set(methodName, txBuilder);
    }
    /** @ignore */
    static defaultCallTxBuilder(sigHashType) {
        return function (current, options, ...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const defaultChangeAddr = yield current.signer.getDefaultAddress();
                const tx = new scryptlib_1.bsv.Transaction()
                    // add non-contract inputs
                    .addInput(current.buildContractInput(options.fromUTXO));
                // add contract outputs
                let nexts = undefined;
                const nextOpts = Array.from([options.next || []]).flat();
                nexts = nextOpts.map((n, idx) => {
                    tx.addOutput(new scryptlib_1.bsv.Transaction.Output({
                        script: n.instance.lockingScript,
                        satoshis: n.balance
                    }));
                    return Object.assign({}, n, { atOutputIndex: idx });
                });
                // add change output
                tx.change(options.changeAddress || defaultChangeAddr);
                if (options.sequence !== undefined) {
                    tx.setInputSequence(0, options.sequence);
                }
                if (options.lockTime) {
                    const _sequence = options.sequence !== undefined ? options.sequence : 0xfffffffe;
                    tx.setInputSequence(0, _sequence); // activate locktime interlock
                    tx.setLockTime(options.lockTime);
                }
                return Promise.resolve({
                    tx,
                    atInputIndex: 0,
                    nexts,
                    next: Array.isArray(nexts) ? nexts[0] : undefined
                });
            });
        };
    }
    /**
     * Build an input that includes the contract
     * @param fromUTXO A parameter to specify the `utxo` where the contract is located
     * @returns an input that includes the contract
     */
    buildContractInput(fromUTXO) {
        if (!fromUTXO && !this.from) {
            throw new Error(`param \`fromUTXO\` and \`this.from\` should not be both empty for calling \`this.buildContractInput\`!`);
        }
        if (fromUTXO) {
            return new scryptlib_1.bsv.Transaction.Input({
                prevTxId: fromUTXO.txId,
                outputIndex: fromUTXO.outputIndex,
                script: new scryptlib_1.bsv.Script(''),
                output: new scryptlib_1.bsv.Transaction.Output({
                    script: this.lockingScript,
                    satoshis: fromUTXO.satoshis
                })
            });
        }
        if ('tx' in this.from) {
            return new scryptlib_1.bsv.Transaction.Input({
                prevTxId: this.from.tx.id,
                outputIndex: this.from.outputIndex,
                script: new scryptlib_1.bsv.Script(''),
                output: new scryptlib_1.bsv.Transaction.Output({
                    script: this.lockingScript,
                    satoshis: this.balance
                })
            });
        }
        else {
            const fromUtxo = this.from;
            return new scryptlib_1.bsv.Transaction.Input({
                prevTxId: fromUtxo.txId,
                outputIndex: fromUtxo.outputIndex,
                script: new scryptlib_1.bsv.Script(''),
                output: new scryptlib_1.bsv.Transaction.Output({
                    script: this.lockingScript,
                    satoshis: this.balance
                })
            });
        }
    }
    /**
     * Check if the contract is a stateful contract
     * @returns true if contract has a `@prop(true)` property
     */
    isStateful() {
        return Reflect.getOwnMetadata(decorators_1.StatePropsMetaKey, this.constructor.prototype) !== undefined;
    }
    /**
     * Get [sigHash type]{@link https://docs.scrypt.io/how-to-write-a-contract/scriptcontext#sighash-type} of the public `@method` function.
     * @param methodName name of the public `@method` function.
     * @returns a sigHash type
     */
    sigTypeOfMethod(methodName) {
        const methodMeta = this.getMethodsMeta(methodName);
        if (!methodMeta) {
            throw new Error(`${methodName} is not a public @method of ${this.constructor.name}`);
        }
        return (0, utils_3.toNumber)(methodMeta.sigHashType);
    }
    /** @ignore */
    getMethodsMeta(methodName) {
        return Reflect.getOwnMetadata(decorators_1.MethodsMetaKey, this.constructor.prototype).get(methodName);
    }
    /** @ignore */
    diffOutputs(outputs) {
        this._assertToExist();
        try {
            const info = (0, diffUtils_1.diffOutputs)(this.delegateInstance, (0, diffUtils_1.getExpectedOutputs)(outputs), (0, diffUtils_1.getTransationOutputs)(this.to.tx, this.to.inputIndex, this.sigTypeOfMethod(this._currentMethod)));
            console.info(info);
        }
        catch (e) {
            throw new Error(`diffOutputs failed, error: ${e.message}`);
        }
    }
    /**
     * A set of functions for debugging contracts, which can only be called in `@method` methods.
     */
    get debug() {
        const self = this;
        return {
            /**
             * [How to Debug ScriptContext Failure]{@link https://docs.scrypt.io/tutorials/how-to-debug-scriptcontext}
             * @param outputs
             */
            diffOutputs: (outputs) => {
                self.diffOutputs(outputs);
            },
            /**
             * Generate a configuration file to start the scrypt debugger
             */
            genLaunchConfig: () => {
                if (this.to) {
                    console.log(self.delegateInstance.genLaunchConfig({
                        tx: self.to.tx,
                        inputIndex: self.to.inputIndex,
                        inputSatoshis: self.to.tx.getInputAmount(self.to.inputIndex)
                    }));
                }
                else {
                    console.log(self.delegateInstance.genLaunchConfig());
                }
            }
        };
    }
    /**
    * Get the current locked balance of the contract
    */
    get balance() {
        this._assertFromExist();
        if ('tx' in this.from) {
            return this.from.tx.outputs[this.from.outputIndex].satoshis;
        }
        else {
            const fromUtxo = this.from;
            return fromUtxo.satoshis;
        }
    }
    /**
     * Get the utxo where the contract is currently located
     */
    get utxo() {
        this._assertFromExist();
        if ('tx' in this.from) {
            return {
                txId: this.from.tx.id,
                outputIndex: this.from.outputIndex,
                script: this.from.tx.outputs[this.from.outputIndex].script.toHex(),
                satoshis: this.from.tx.outputs[this.from.outputIndex].satoshis
            };
        }
        else {
            const fromUtxo = this.from;
            return fromUtxo;
        }
    }
    /**
     * You can directly access the context through `this.ctx` in any public @method.
     * [ScriptContext]{@link https://docs.scrypt.io/how-to-write-a-contract/scriptcontext} can be considered additional information a public method gets when called, besides its function parameters.
     * @onchain
     */
    get ctx() {
        if (!this._ctx) {
            throw new Error('`this.ctx` is undefined, `to` should be called before to access its value!');
        }
        return this._ctx;
    }
    /**
     * @ignore
     * recover a `SmartContract` instance from the locking script
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this locking script moment
     * @param script hex string of locking script
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this locking script moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromLockingScript(script, offchainValues, nopScript) {
        if (!this.DelegateClazz) {
            (0, error_1.throwUnInitializing)(this.name);
        }
        let delegateInstance;
        if (nopScript) {
            if (!script.startsWith(nopScript.toHex())) {
                throw new Error(`script doesn't start with nopScript`);
            }
            const contractScript = script.slice(nopScript.toHex().length);
            // deserialize from the locking script of specified tx output
            delegateInstance = this.DelegateClazz.fromHex(contractScript);
        }
        else {
            delegateInstance = this.DelegateClazz.fromHex(script);
        }
        // recreate instance
        const args = delegateInstance.ctorArgs().map(arg => {
            // if the constructor has arguments of type `HashedMap` or `HashedSet`
            // it's fine to pass a dummy empty one for calling
            // because their raw data will be replaced later
            if (arg.type.startsWith('HashedMap')) {
                return new types_1.HashedMap();
            }
            if (arg.type.startsWith('HashedSet')) {
                return new types_1.HashedSet();
            }
            return arg.value;
        });
        const instance = new this(...args);
        instance.delegateInstance = delegateInstance;
        instance.prependNOPScript(nopScript || null);
        // for `instance.delegateInstance`
        // all the properties (actually it only has state properties)
        // whatever the type, their values are good here
        // for `instance` itself
        // [1] all the onchain properties of type `HashedMap` or `HashedSet`
        //     (should be updated to the corresponding value in `offchainValues`)
        // [2] all the state properties except `HashedMap` and `HashedSet` when `isGenesis` is `false`
        //     (should be updated to the corresponding value in `delegateInstance`)
        // [3] offchain properties
        //     (should be updated to the corresponding value in `offchainValues`)
        // their values are NOT good yet here
        // names of those properties with `@prop()` and `@prop(true)` decorator
        const onchainPropNames = Reflect.getMetadata(decorators_1.PropsMetaKey, instance) || [];
        // names of those properties with `@prop(true)` decorator
        const statePropNames = delegateInstance.stateProps.map(p => p.name) || [];
        // handle onchain properties of `instance`
        onchainPropNames.forEach(p => {
            const isGenesis = delegateInstance.isGenesis;
            if (instance[p] instanceof types_1.HashedMap || instance[p] instanceof types_1.HashedSet) {
                // [1]
                // for onchain property of type `HashedMap` or `HashedSet`
                // require to pass its raw data
                if (offchainValues === undefined || offchainValues[p] === undefined) {
                    throw new Error(`should pass the currrent value of \`${p}\``);
                }
                // require `instance[p]` and `offchainValues[p]` has the same type
                if (instance[p] instanceof types_1.HashedMap && !(offchainValues[p] instanceof types_1.HashedMap)) {
                    throw new Error(`\`offchainValues.${p}\` should be a HashedMap`);
                }
                if (instance[p] instanceof types_1.HashedSet && !(offchainValues[p] instanceof types_1.HashedSet)) {
                    throw new Error(`\`offchainValues.${p}\` should be a HashedSet`);
                }
                // attach its raw data
                offchainValues[p].attachTo(instance[p]._type, this.DelegateClazz);
                // require the hashed value of passed raw data should be the same as it is on the chain
                // ONLY for the state properties and when `isGenesis` is false
                // otherwise, we cannot do such a restriction, because
                // if it's not a state property, then `delegateInstance[p]` is `undefined`
                // and we can't read the hashed value of non-state onchain properties from the chain in other ways, either
                // if `isGenesis` is true, then `delegateInstance[p]` is the default value
                // and `delegateInstance[p]._data` might not be correct, either
                if (statePropNames.includes(p) && !isGenesis && delegateInstance[p]._data !== offchainValues[p].data()) {
                    throw new Error(`the current value of \`${p}\` passed in does not match the state in the script`);
                }
                // assign the raw data to onchain property of `instance`
                instance[p] = offchainValues[p];
            }
            else if (statePropNames.includes(p) && !isGenesis) {
                // [2]
                // for state property except `HashedMap` and `HashedSet` when `isGenesis` is `false`
                // if `isGenesis` is `true`, then state property `instance[p]` is already good after calling the constructor
                instance[p] = delegateInstance[p];
            }
        });
        // for `instance` itself
        // all the onchain properties, whatever the type, their value are good here
        // [3]
        // for offchain properties that passed with `offchainValues`
        // directly assign value to the corresponding property of `instance`
        Object.getOwnPropertyNames(offchainValues || {})
            .filter(p => !onchainPropNames.includes(p))
            .forEach(p => instance[p] = offchainValues[p]);
        // all good here
        return instance;
    }
    /**
     * recover a `SmartContract` instance from the transaction
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this transaction moment
     * @param tx transaction
     * @param atOutputIndex output index of `tx`
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this transaction moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromTx(tx, atOutputIndex, offchainValues, nopScript) {
        if (atOutputIndex < 0 || atOutputIndex >= tx.outputs.length) {
            throw new Error(`the value of \`atOutputIndex\` is out of range [0, ${tx.outputs.length})`);
        }
        const instance = this.fromLockingScript(tx.outputs[atOutputIndex].script.toHex(), offchainValues, nopScript);
        instance.from = {
            tx,
            outputIndex: atOutputIndex
        };
        return instance;
    }
    /**
     * recover a `SmartContract` instance from the transaction
     * if the contract contains onchain properties of type `HashedMap` or `HashedSet`
     * it's required to pass all their offchain raw data at this transaction moment
     * @param tx transaction
     * @param offchainValues the value of offchain properties, the raw data of onchain `HashedMap` and `HashedSet` properties, at this transaction moment
     * @param nopScript a script if contract locking script startwiths a nopScript.
     */
    static fromUTXO(utxo, offchainValues, nopScript) {
        const instance = this.fromLockingScript(utxo.script, offchainValues, nopScript);
        instance.from = utxo;
        return instance;
    }
    /** @ignore */
    static dummySignMultiCallTx(tx, calllogs) {
        const instances = calllogs.map(log => log.instance);

        /*
        
        if(dummyTXFlag)
        {
            //tx.inputs = dummyTx.inputs


            for(let i = 0; i < tx.inputs.length; i++)
            {
                console.log("tx.inputs[", i, ']', tx.inputs[i])
                console.log("dummyTx.inputs[", i, ']', dummyTx.inputs[i])
                //tx.inputs[i] = dummyTx.inputs[i]
            }
        }
        */
        
        tx.inputs.forEach((input, idx) => {
            if (instances[idx]) {
                // build a signed dummyTx to estimate fee
                const methodArgsWithDummySig = calllogs[idx].methodArgs.map((arg, argIdx) => {
                    const sigArg = calllogs[idx].sigArgs.get(argIdx);
                    if (sigArg) {
                        // replace sig-related args with dummy values
                        return sigArg.length > 1 ? new Array(sigArg.length).fill((0, utils_3.getDummySig)()) : (0, utils_3.getDummySig)();
                    }
                    else {
                        return arg;
                    }
                });
                const { publicMethodCall } = instances[idx].callDelegatedMethod(calllogs[idx].methodName, ...methodArgsWithDummySig);
                input.setScript(publicMethodCall.toScript());
            }
        });
    }
    /** @ignore */
    static signMultiCallTx(signer, tx, address, calllogs, options) {
        //console.log('Inside signMultiCallTx', tx.outputs[tx.outputs.length - 1])
        //console.log('Tx.input.length: ', tx.inputs.length)
        //console.log('Tx.input[1]: ', (tx.inputs[dummyTx.inputs.length - 1]))
        
        return __awaiter(this, void 0, void 0, function* () {
            const instances = calllogs.map(log => log.instance);
            // build sig requests for all inputs of transaction
            const network = signer.provider.getNetwork();
            const sigRequests = tx.inputs.flatMap((input, idx) => {
                // If autoPayFee is false, then only sign contract call input.
                // Else, sign ALL inputs.
                if (!options.autoPayFee && instances[idx] === undefined) {
                    return undefined;
                }
                if (instances[idx]) {
                    const pubKeyOrAddrToSign = calllogs[idx].pubKeyOrAddrToSign;
                    const sigOptions = pubKeyOrAddrToSign ? (0, utils_1.parseSignatureOption)(pubKeyOrAddrToSign, network) : [{
                            address,
                            sigHashType: scryptlib_1.DEFAULT_SIGHASH_TYPE,
                            csIdx: undefined,
                        }];
                    return sigOptions.map(item => {
                        return {
                            prevTxId: (0, scryptlib_1.toHex)(input.prevTxId),
                            outputIndex: input.outputIndex,
                            inputIndex: idx,
                            satoshis: input.output.satoshis,
                            scriptHex: input.output.script.toHex(),
                            address: item.address,
                            sigHashType: item.sigHashType,
                            csIdx: item.csIdx,
                        };
                    });
                }
                else {
                    return {
                        prevTxId: (0, scryptlib_1.toHex)(input.prevTxId),
                        outputIndex: input.outputIndex,
                        inputIndex: idx,
                        satoshis: input.output.satoshis,
                        scriptHex: input.output.script.toHex(),
                        address,
                        sigHashType: scryptlib_1.DEFAULT_SIGHASH_TYPE,
                        csIdx: undefined,
                    };
                }
            }).filter((val) => val !== undefined);
            const sigResponses = yield signer.getSignatures(tx.toString(), sigRequests);

            //console.log('*******sigResponses: ', sigResponses)
            //console.log('*******signer: ', signer.txPreimage[0])
            //console.log('*******signer: ', signer.txPreimage[1])

            sigResponses
                // group by inputIndex
                .reduce((group, sigResp) => {
                const inputIdx = sigResp.inputIndex;
                const sigs = group.get(inputIdx) || [];
                sigs.push(sigResp);
                group.set(inputIdx, sigs);
                return group;
            }, new Map())
                // apply signatures
                .forEach((sigResponses, idx) => {
                if (instances[idx]) {
                    let methodArgs_ = calllogs[idx].methodArgs.map((arg, argIdx) => {
                        const sigArg = calllogs[idx].sigArgs.get(argIdx);
                        if (!sigArg) {
                            return arg;
                        }
                        const validateSig = (sig) => {
                            if (typeof sig !== 'string') {
                                throw new Error(`the ${argIdx + 1}th argument calback function should returns a valid \`Sig\``);
                            }
                        };
                        const sigs = sigArg.callback.call(this, sigResponses) || '';
                        if (sigs instanceof Array) {
                            if (sigs.length !== sigArg.length) {
                                throw new Error(`the ${argIdx + 1}th argument calback function should returns a valid \`Sig\` array whose length is expected to be ${sigArg.length}, but got ${sigs.length}`);
                            }
                            sigs.forEach(sig => validateSig(sig));
                        }
                        else {
                            validateSig(sigs);
                        }
                        return sigs;
                    });
                    if (calllogs[idx].exec) {
                        const script = instances[idx].getUnlockingScript(self => {
                            self[calllogs[idx].methodName](...methodArgs_);
                        });
                        tx.inputs[idx].setScript(script);
                    }
                    else {
                        const { publicMethodCall } = instances[idx].callDelegatedMethod(calllogs[idx].methodName, ...methodArgs_);
                        tx.inputs[idx].setScript(publicMethodCall.toScript());
                    }
                }
                else {
                    if (options.autoPayFee) {
                        sigResponses.forEach(sigResp => {
                            tx.applySignature({
                                inputIndex: sigResp.inputIndex,
                                sigtype: sigResp.sigHashType || scryptlib_1.DEFAULT_SIGHASH_TYPE,
                                publicKey: scryptlib_1.bsv.PublicKey.fromString(sigResp.publicKey),
                                signature: scryptlib_1.bsv.crypto.Signature.fromTxFormat(Buffer.from(sigResp.sig, 'hex'))
                            });
                        });
                    }
                }
            });
        });
    }
    /**
    * When the `@method`s of multiple contracts is called in a transaction, this function signs and broadcasts the final transaction.
    * @param partialContractTx a `ContractTransation` with a unsigned transation.
    * @param signer a signer to sign the transation.
    * @returns a `MultiContractTransation` with a signed transation.
    */
    static multiContractCall(partialContractTx, signer, options) {
        return __awaiter(this, void 0, void 0, function* () {

            options = Object.assign({}, {
                verify: false,
                partiallySigned: false,
                autoPayFee: true
            }, options);


            let tx = partialContractTx.tx;


            let calllogs = tx['calllogs'];
            if (tx.inputs.length < calllogs.length) {
                throw new Error(`Check if all called contracts are added as inputs to the transaction`);
            }
            const autoPayFee = options.autoPayFee;
            const address = yield signer.getDefaultAddress();
            const feePerKb = yield signer.provider.getFeePerKb();
            //const feePerKb = FeeKB2023;
            // Add dummy data to input in order to get the fee estimate right.
            this.dummySignMultiCallTx(tx, calllogs);

            if (autoPayFee) {
                // Add fee inputs and adjust change out value.
                const calllog = calllogs.find(calllog => {
                    return calllog.instance.hasPrevouts(calllog.methodName);
                });
                const hasPrevouts = calllog !== undefined;

               
                yield this.autoPayfee(tx, feePerKb, signer, address, hasPrevouts ? 36 * calllogs.length : 0);
                if (hasPrevouts) {
                    this.dummySignMultiCallTx(tx, calllogs);

                    // Only adjust change out value.
                    tx['_feePerKb'] = feePerKb;
                    Object.getPrototypeOf(tx)._updateChangeOutput.apply(tx);
                }
            }

            yield this.signMultiCallTx(signer, tx, address, calllogs, options);

            if (!options.partiallySigned) {
                if (options.verify || process.env.NETWORK === 'local') {
                    const result = tx.verify();

                    if (typeof result === 'string') {
                        throw new Error(`Transaction verify failed: ${result}`);
                    }
                }
                              
                yield signer.provider.sendTransaction(tx);
            }
            //console.log("Complete Signed TX: ", scryptlib_1.sha256(scryptlib_1.toHex(tx)))
            return {
                tx,
                atInputIndices: calllogs.map(log => log.atInputIndex),
                nexts: (0, diffUtils_1.mergeNexts)(calllogs)
            };
        });
    }

    ///////////////////////////////////////////////////////////////
    // Jesus is The LORD!!!
    //      Para ECDSA Oracle
    ///////////////////////////////////////////////////////////////
    static multiContractCallV2(partialContractTx, signer, options) {
        return __awaiter(this, void 0, void 0, function* () {

            options = Object.assign({}, {
                verify: false,
                partiallySigned: false,
                autoPayFee: true
            }, options);


            let tx = partialContractTx.tx;

            ///////////////////////////////////////////////////
            // Jesus is The LORD!!!
            //
            //  O troco Dummy dever ser acrescentado
            //      antes de qualquer chamada a
            //      callDelegatedMethod
            ///////////////////////////////////////////////////
                        
            console.log('Dummy Flag 1: ', dummyTXFlag)
            if(dummyTXFlag)
            {
                dummyChangeOutput = dummyTx.outputs[dummyTx.outputs.length - 1].satoshis

            }
              
            ///////////////////////////////////////////////////
            ///////////////////////////////////////////////////


            let calllogs = tx['calllogs'];
            if (tx.inputs.length < calllogs.length) {
                throw new Error(`Check if all called contracts are added as inputs to the transaction`);
            }
            const autoPayFee = options.autoPayFee;
            const address = yield signer.getDefaultAddress();
            const feePerKb = yield signer.provider.getFeePerKb();
            //const feePerKb = FeeKB2023;
            // Add dummy data to input in order to get the fee estimate right.
            this.dummySignMultiCallTx(tx, calllogs);

            console.log("TX Main First Dummy: ", scryptlib_1.toHex(tx))


            if (autoPayFee) {

                console.log("Entrou em AutoPayFee: ")
                // Add fee inputs and adjust change out value.
                const calllog = calllogs.find(calllog => {
                    return calllog.instance.hasPrevouts(calllog.methodName);
                });
                const hasPrevouts = calllog !== undefined;
               
                console.log("Antes de this.autoPayfee: ")
                yield this.autoPayfee(tx, feePerKb, signer, address, hasPrevouts ? 36 * calllogs.length : 0);
                console.log("Depois de this.autoPayfee: ")
                //if (hasPrevouts) {
                if (hasPrevouts || dummyTXFlag) {
    
                    console.log("Depois de hasPrevouts: ")
                    this.dummySignMultiCallTx(tx, calllogs);

                    //console.log('tx.getChangeOutput(): Before Inputs', tx.getChangeOutput())

                    console.log('Dummy Flag 2: ', dummyTXFlag)

                    if(dummyTXFlag)
                    {
                        //console.log("TX Main: ", scryptlib_1.sha256(scryptlib_1.toHex(tx)))
                        //console.log("TX Main: ", (scryptlib_1.toHex(tx)))
                        //console.log("TX Dummy: ", scryptlib_1.sha256(scryptlib_1.toHex(dummyTx)))
                        //console.log("TX Dummy: ", (scryptlib_1.toHex(dummyTx)))

                        tx.inputs = dummyTx.inputs
                        //console.log('tx.getChangeOutput(): After Inputs', tx.getChangeOutput())

                        //console.log('dummyTx.getChangeOutput(): ', dummyTx.getChangeOutput())
                        
                        tx.outputs = dummyTx.outputs // substitui pelos output da TX dummy
                        dummyChangeOutput = dummyTx.outputs[dummyTx.outputs.length - 1].satoshis

                        //dummyPrevOuts = scryptlib_1.toHex(dummyTx.prevouts())
                        //console.log('tx.outputs SIZE after dummy: ', tx.outputs.length)
                        //dummyTXFlag = false //Deve ser desabilitado externamente
                    }
                    else
                    {
                        // Only adjust change out value.
                        tx['_feePerKb'] = feePerKb;
                        Object.getPrototypeOf(tx)._updateChangeOutput.apply(tx);

                    }
                    /////////////////////////////////////
                    /////////////////////////////////////

                }
            }

            yield this.signMultiCallTx(signer, tx, address, calllogs, options);

            
            //Esta etapa foi levada para ser executada dentro do método 
            //      callDelegatedMethod

            /*
            let rawTxOriginal = scryptlib_1.toHex(tx) 
            let rawTX = ''

            if(dummyTXFlag && dummyChangeOutput > 0)
            {
                //console.log("Complete Signed TX: ", (scryptlib_1.toHex(tx)))
                rawTX = scryptlib_1.toHex(tx)

                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Original Flag: ', 
                    rawTX.substring(
                        rawTX.indexOf('0000000041000000') + '0000000041000000'.length,
                        rawTX.indexOf('0000000041000000') + '0000000041000000'.length + 2
                        )
                    )

                let changeThis = 0
                let changeFlag = ''
                if(dummyChangeOutput <= 16)
                {
                    changeThis = 80 + dummyChangeOutput
                    changeFlag = changeThis.toString(16)

                }    
                if(dummyChangeOutput > 16)//Verificar
                {
                    changeFlag = changeThis.toString(16)
                    while(changeFlag.length % 2 ===1)
                    {
                        changeFlag = '0' + changeFlag
                    }
                    const bytePairs = changeFlag.match(/.{1,2}/g);
                    const reversedPairs = bytePairs.reverse();
                    changeFlag = reversedPairs.join('');
                    changeFlag = changeFlag.length.toString(16) + changeFlag                 

                }
    
                rawTX = rawTX.substring(0, rawTX.indexOf('0000000041000000') + '0000000041000000'.length)
                        + changeFlag//'52'
                        + rawTX.substring(rawTX.indexOf('0000000041000000') + '0000000041000000'.length + 2)                           
    
                //console.log("TX FLAG 52: ", rawTX)

                //desliga a Flag dummyTXFlag após uso da transação dummy
                dummyTXFlag = false //Deve ser desabilitado externamente
            }
            */

            console.log("TX Main: ", scryptlib_1.toHex(tx))

            if (!options.partiallySigned) {
                if (options.verify || process.env.NETWORK === 'local') {
                    const result = tx.verify();

                    if (typeof result === 'string') {
                        throw new Error(`Transaction verify failed: ${result}`);
                    }
                }
                               

                //Esta flag deve ser desabilitada depois de todo o processamento
                //  de transação dummy
                dummyTXFlag = false //Deve ser desabilitado externamente

                yield broadcast(scryptlib_1.toHex(tx), signer.network)
                /*
                if(rawTX === '')
                {
                    //yield broadcast(scryptlib_1.toHex(tx), this._network)
                    yield broadcast(scryptlib_1.toHex(tx), signer.network)
                }
                else
                {
                    
                    yield broadcast(rawTX, signer.network)
                    //let txFinal = new scryptlib_1.bsv.Transaction(rawTX)
                    return rawTX
                }

                */
            }
            //console.log("Complete Signed TX: ", scryptlib_1.sha256(scryptlib_1.toHex(tx)))
            return scryptlib_1.toHex(tx)
            
        });
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////
    //  Jesus is The Lord!!!
    //      Cria a Transação Dummy para ser assinada pelo Oraculo
    ///////////////////////////////////////////////////////////////
    static multiContractCallDummy(partialContractTx, signer, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({}, {
                verify: false,
                partiallySigned: false,
                autoPayFee: true
            }, options);
            const tx = partialContractTx.tx;
            let calllogs = tx['calllogs'];
            if (tx.inputs.length < calllogs.length) {
                throw new Error(`Check if all called contracts are added as inputs to the transaction`);
            }
            const autoPayFee = options.autoPayFee;
            const address = yield signer.getDefaultAddress();
            const feePerKb = yield signer.provider.getFeePerKb();
            //const feePerKb = FeeKB2023;
            // Add dummy data to input in order to get the fee estimate right.
            this.dummySignMultiCallTx(tx, calllogs);
            if (autoPayFee) {
                // Add fee inputs and adjust change out value.
                const calllog = calllogs.find(calllog => {
                    return calllog.instance.hasPrevouts(calllog.methodName);
                });
                const hasPrevouts = calllog !== undefined;
                yield this.autoPayfee(tx, feePerKb, signer, address, hasPrevouts ? 36 * calllogs.length : 0);
                if (hasPrevouts) {
                    this.dummySignMultiCallTx(tx, calllogs);
                    // Only adjust change out value.
                    tx['_feePerKb'] = feePerKb;
                    //Object.getPrototypeOf(tx)._updateChangeOutput.apply(tx);
                }
            }

            /////////////////////////////////////
            //Jesus is the Lord!!!
            // and Giver of all Solutions
            /////////////////////////////////////            
            dummyTx = tx
            dummyTXFlag = true
            console.log('Dummy Flag 0: ', dummyTXFlag)

            /////////////////////////////////////            
            /////////////////////////////////////            

            //console.log("**Dummy Sig PREIMAGE: ", scryptlib_1.sha256(scryptlib_1.toHex(tx[0].getPreimage(tx,0))))


            //yield this.signMultiCallTx(signer, tx, address, calllogs, options);
            /*if (!options.partiallySigned) {
                if (options.verify || process.env.NETWORK === 'local') {
                    const result = tx.verify();

                    if (typeof result === 'string') {
                        throw new Error(`Transaction verify failed: ${result}`);
                    }
                }
                //yield signer.provider.sendTransaction(tx);
            } */
            return {
                tx,
                atInputIndices: calllogs.map(log => log.atInputIndex),
                nexts: (0, diffUtils_1.mergeNexts)(calllogs)
            };
        });
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////
    //  Jesus is The Lord!!!
    ///////////////////////////////////////////////////////////////
    static dummyFlagOff() {
        dummyTXFlag = false
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////


    /**
     * parse call data when a contract public method called in a transation.
     * @param tx
     * @param inputIndex
     * @returns
     */
    static parseCallData(tx, inputIndex) {
        if (!this.DelegateClazz) {
            (0, error_1.throwUnInitializing)(this.name);
        }
        const unlockScript = tx.inputs[inputIndex].script;
        const callData = this.DelegateClazz.abiCoder.parseCallData(unlockScript.toHex());
        return Object.assign(Object.assign({}, callData), { args: callData.args.filter(a => !a.name.startsWith('__scrypt_ts')) });
    }
    /** @ignore */
    static autoPayfee(tx, feePerKb, signer, address, additional = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            // don't use tx.feePerKb(feePerKb); it will clear sig
            tx['_feePerKb'] = feePerKb;
            if (tx.checkFeeRate()) {
                return;
            }
            // todo fix bsv type
            let estimateSize = Object.getPrototypeOf(tx)._estimateSize.apply(tx);
            let inputAmount = tx.inputAmount;
            let outputAmount = tx.outputAmount;

            if (tx.getChangeOutput() === null && tx.getChangeAddress() !== null) {
                // 34 bytes is a change output size
                estimateSize += 34;
                // min change amount
                outputAmount += 1;
            }
            // n stands for n utxo, and provder provides
            // providerAmount represents the total amount of utxo provided by provider
            // feePerKb <=  unspentValue / estimateSize * 1000
            // feePerKb <= (unspentValue + providerAmount) / ((estimateSize + (180 * n)) * 1000
            // build the real tx

            //console.log("Fee/KB Contract: ", feePerKb)

            let feeUtxos = yield signer.listUnspent(address, {
                unspentValue: inputAmount - outputAmount,
                estimateSize: estimateSize,
                feePerKb,
                additional
            });
            tx.from(feeUtxos);
            if (!tx.checkFeeRate()) {
                throw new Error(`no sufficient utxos to pay the fee ${Math.ceil(estimateSize / 1000 * feePerKb)}`);
            }
        });
    }
    prependNOPScript(nopScript) {
        this.delegateInstance.prependNOPScript(nopScript);
    }
    getPrependNOPScript() {
        return this.delegateInstance.getPrependNOPScript();
    }
}
exports.SmartContract = SmartContract;
//# sourceMappingURL=contract.js.map