"use strict";
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
exports.TestWallet = void 0;
const abstract_signer_1 = require("../abstract-signer");
const dist_1 = require("scryptlib/dist");
const utils_1 = require("../utils");
const DEFAULT_SIGHASH_TYPE = dist_1.bsv.crypto.Signature.ALL;
/**
 * An implemention of a simple wallet which should just be used in dev/test environments.
 * It can hold multiple private keys and have a feature of cachable in-memory utxo management.
 *
 * Reminder: DO NOT USE IT IN PRODUCTION ENV.
 */
class TestWallet extends abstract_signer_1.Signer {
    constructor(privateKey, provider) {
        super(provider);
        this.splitFeeTx = true;
        if (privateKey instanceof Array) {
            this._privateKeys = privateKey;
        }
        else {
            this._privateKeys = [privateKey];
        }
        this.checkPrivateKeys();
        this._utxoManagers = new Map();
    }
    enableSplitFeeTx(on) {
        this.splitFeeTx = on;
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(true);
        });
    }
    requestAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({ isAuthenticated: true, error: '' });
        });
    }

    get network() {
        return this.provider.getNetwork();
    }

    //////////////////////// 
    // Jesus is The Lord
    ////////////////////////
    //Se for necessário
    /*
    get network() {
        return dist_1.bsv.Networks.testnet;
        //return dist_1.bsv.Networks.mainnet;
    }
    */

    get addresses() {
        return this._privateKeys.map(p => p.toAddress(this.network).toString());
    }
    addPrivateKey(privateKey) {
        const keys = privateKey instanceof Array ? privateKey : [privateKey];
        this._privateKeys.push(...keys);
        this.checkPrivateKeys();
        return this;
    }
    checkPrivateKeys() {
        const networks = this._privateKeys.map(key => key.toAddress().network);
        if (!networks.every(n => n.name === networks[0].name)) {
            throw new Error(`All private keys should be ${networks[0].name} private key`);
        }
        return networks[0];
    }
    getDefaultAddress() {
        return Promise.resolve(this._defaultPrivateKey.toAddress());
    }
    getDefaultPubKey() {
        return Promise.resolve(this._defaultPrivateKey.toPublicKey());
    }
    getPubKey(address) {
        return Promise.resolve(this._getPrivateKeys(address)[0].toPublicKey());
    }


    //getNetwork() {
    //    return Promise.resolve(this._defaultPrivateKey.toAddress().network);
    //}


    signRawTransaction(rawTxHex, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sigReqsByInputIndex = ((options === null || options === void 0 ? void 0 : options.sigRequests) || []).reduce((m, sigReq) => { m.set(sigReq.inputIndex, sigReq); return m; }, new Map());
            const tx = new dist_1.bsv.Transaction(rawTxHex);
            tx.inputs.forEach((_, inputIndex) => {
                const sigReq = sigReqsByInputIndex.get(inputIndex);
                if (!sigReq) {
                    throw new Error(`\`SignatureRequest\` info should be provided for the input ${inputIndex} to call #signRawTransaction`);
                }
                const script = sigReq.scriptHex ? new dist_1.bsv.Script(sigReq.scriptHex) : dist_1.bsv.Script.buildPublicKeyHashOut(sigReq.address.toString());
                // set ref output of the input
                tx.inputs[inputIndex].output = new dist_1.bsv.Transaction.Output({
                    script,
                    satoshis: sigReq.satoshis
                });
            });
            const signedTx = yield this.signTransaction(tx, options);
            return signedTx.toString();
        });
    }
    signTransaction(tx, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = options === null || options === void 0 ? void 0 : options.address;
            this._checkAddressOption(addresses);
            // TODO: take account of SignatureRequests in options.
            return Promise.resolve(tx.sign(this._getPrivateKeys(addresses)));
        });
    }
    signMessage(message, address) {
        throw new Error("Method #signMessage not implemented.");
    }
    getSignatures(rawTxHex, sigRequests) {
        this._checkAddressOption(this._getAddressesIn(sigRequests));
        const tx = new dist_1.bsv.Transaction(rawTxHex);
        const sigResponses = sigRequests.flatMap(sigReq => {
            const script = sigReq.scriptHex ? new dist_1.bsv.Script(sigReq.scriptHex) : dist_1.bsv.Script.buildPublicKeyHashOut((0, utils_1.parseAddresses)(sigReq.address, this.network)[0]);
            tx.inputs[sigReq.inputIndex].output = new dist_1.bsv.Transaction.Output({
                // TODO: support multiSig?
                script: script,
                satoshis: sigReq.satoshis
            });
            const privkeys = this._getPrivateKeys(sigReq.address);
            return privkeys.map(privKey => {
                // Split to subscript if OP_CODESEPARATOR is being employed.
                const subScript = sigReq.csIdx !== undefined ? script.subScript(sigReq.csIdx) : script;
                const sig = (0, dist_1.signTx)(tx, privKey, subScript, sigReq.satoshis, sigReq.inputIndex, sigReq.sigHashType);
                return {
                    sig: sig,
                    publicKey: privKey.publicKey.toString(),
                    inputIndex: sigReq.inputIndex,
                    sigHashType: sigReq.sigHashType || DEFAULT_SIGHASH_TYPE,
                    csIdx: sigReq.csIdx,
                };
            });
        });
        return Promise.resolve(sigResponses);
    }
    connect(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            if (provider) {
                const network = this.checkPrivateKeys();
                const providerNetWork = yield provider.getNetwork();
                if (network.name !== providerNetWork.name) {
                    throw new Error(`Should connect to a ${network.name} provider`);
                }
                if (!provider.isConnected()) {
                    yield provider.connect();
                }
                this.provider = provider;
            }
            else {
                if (this.provider) {
                    yield this.provider.connect();
                }
                else {
                    throw new Error(`No provider found`);
                }
            }
            return this;
        });
    }
    listUnspent(address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.splitFeeTx) {
                let utxoManager = this._utxoManagers.get(address.toString());
                if (!utxoManager) {
                    utxoManager = new CacheableUtxoManager(address, this);
                    this._utxoManagers.set(address.toString(), utxoManager);
                    yield utxoManager.init();
                }
                if (options) {
                    const unspentValue = options.unspentValue;
                    const estimateSize = options.estimateSize;
                    const feePerKb = options.feePerKb;
                    // providerAmount = ((estimateSize + (180 * n)) / 1000 * feePerKb) - unspentValue
                    let providerAmount = Math.ceil((estimateSize / 1000 * feePerKb) - unspentValue);
                    providerAmount += Math.ceil(((options.additional || 0) + 180) / 1000 * feePerKb);
                    return utxoManager.fetchUtxos(providerAmount);
                }
                else {
                    return utxoManager.fetchUtxos(0);
                }
            }
            else {
                return this.provider.listUnspent(address, options);
            }
        });
    }
    _getAddressesIn(sigRequests) {
        return (sigRequests || []).flatMap((req) => {
            return req.address instanceof Array ? req.address : [req.address];
        });
    }
    _checkAddressOption(address) {
        if (!address)
            return;
        if (address instanceof Array) {
            address.forEach(address => this._checkAddressOption(address));
        }
        else {
            if (!this.addresses.includes(address.toString())) {
                throw new Error(`the address ${address.toString()} does not belong to this TestWallet`);
            }
        }
    }
    get _defaultPrivateKey() {
        return this._privateKeys[0];
    }
    _getPrivateKeys(address) {
        if (!address)
            return [this._defaultPrivateKey];
        this._checkAddressOption(address);
        let addresses = [];
        if (address instanceof Array) {
            address.forEach(addr => addresses.push(addr.toString()));
        }
        else {
            addresses.push(address.toString());
        }
        return this._privateKeys.filter(priv => addresses.includes(priv.toAddress(this.network).toString()));
    }
    signAndsendTransaction(tx, options) {
        const _super = Object.create(null, {
            signAndsendTransaction: { get: () => super.signAndsendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const signedTx = yield _super.signAndsendTransaction.call(this, tx, options);
            const address = yield this.getDefaultAddress();
            let utxoManager = this._utxoManagers.get(address.toString());
            if (utxoManager) {
                utxoManager.collectUtxoFromTx(tx);
            }
            return signedTx;
        });
    }
}
exports.TestWallet = TestWallet;
var InitState;
(function (InitState) {
    InitState[InitState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    InitState[InitState["INITIALIZING"] = 1] = "INITIALIZING";
    InitState[InitState["INITIALIZED"] = 2] = "INITIALIZED";
})(InitState || (InitState = {}));
;
class CacheableUtxoManager {
    constructor(address, signer) {
        this.availableUtxos = [];
        this.initStates = InitState.UNINITIALIZED;
        this.initUtxoCnt = 0;
        this.feePerkb = 50;
        this.address = address;
        this.signer = signer;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initStates === InitState.INITIALIZED) {
                return this;
            }
            if (this.initStates === InitState.UNINITIALIZED) {
                this.initStates = InitState.INITIALIZING;
                this.availableUtxos = yield this.signer.connectedProvider.listUnspent(this.address);
                this.feePerkb = yield this.signer.connectedProvider.getFeePerKb();
                this.initStates = InitState.INITIALIZED;
                this.initUtxoCnt = this.availableUtxos.length;
                console.log(`current balance of address ${this.address} is ${this.availableUtxos.reduce((r, utxo) => r + utxo.satoshis, 0)} satoshis`);
            }
            while (this.initStates === InitState.INITIALIZING) {
                yield sleep(1);
            }
            return this;
        });
    }
    fetchUtxos(targetSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initStates === InitState.INITIALIZED
                && this.initUtxoCnt > 0
                && this.availableUtxos.length === 0) {
                const timeoutSec = 30;
                for (let i = 0; i < timeoutSec; i++) {
                    console.log('waiting for available utxos');
                    yield sleep(1);
                    if (this.availableUtxos.length > 0) {
                        break;
                    }
                }
            }
            if (targetSatoshis <= 0) {
                return this.availableUtxos.splice(0);
            }
            const sortedUtxos = this.availableUtxos.sort((a, b) => a.satoshis - b.satoshis);
            if (targetSatoshis > sortedUtxos.reduce((r, utxo) => r + utxo.satoshis, 0)) {
                throw new Error('no sufficient utxos to pay the fee of ' + targetSatoshis);
            }
            let idx = 0;
            let accAmt = 0;
            const dustLimit = 1; //min change amount
            let expectedAmt = 0;
            for (let i = 0; i < sortedUtxos.length; i++) {
                accAmt += sortedUtxos[i].satoshis;
                // estimateFee of splitTx 
                // 180 - Input.BASE_SIZE + PublicKeyHashInput.SCRIPT_MAX_SIZE
                // 10 + 34 * 2 - transation header and two output
                const estimateFee = Math.ceil((180 * (i + 1) + (10 + 34) * 2) * this.feePerkb / 1000);
                expectedAmt = targetSatoshis + estimateFee + dustLimit;
                if (accAmt >= expectedAmt) {
                    idx = i;
                    break;
                }
            }
            const usedUtxos = sortedUtxos.slice(0, idx + 1);
            // update the available utxos, remove used ones
            this.availableUtxos = sortedUtxos.slice(idx + 1);
            if (accAmt >= expectedAmt) {
                // split `accAmt` to `targetSatoshis` + `change` 
                const splitTx = new dist_1.bsv.Transaction().from(usedUtxos)
                    .addOutput(new dist_1.bsv.Transaction.Output({
                    script: dist_1.bsv.Script.buildPublicKeyHashOut(this.address),
                    satoshis: targetSatoshis
                }))
                    .feePerKb(this.feePerkb)
                    .change(this.address); // here generates a new available utxo for address
                yield this.signer.signAndsendTransaction(splitTx);
                // return the new created utxo which has value of `targetSatoshis`
                const index = this.availableUtxos.findIndex(utxo => utxo.satoshis === targetSatoshis);
                return this.availableUtxos.splice(index, 1);
            }
            else {
                return usedUtxos;
            }
        });
    }
    collectUtxoFromTx(tx) {
        const txId = tx.id;
        tx.outputs.forEach((output, index) => {
            this.collectUtxoFrom(output, txId, index);
        });
    }
    collectUtxoFrom(output, txId, outputIndex) {
        if (output.script.toHex() === this.utxoScriptHex) {
            this.availableUtxos.push({
                txId,
                outputIndex,
                satoshis: output.satoshis,
                script: output.script.toHex()
            });
        }
    }
    get utxoScriptHex() {
        // all managed utxos should have the same P2PKH script for `this.address`
        return dist_1.bsv.Script.buildPublicKeyHashOut(this.address).toHex();
    }
}
const sleep = (seconds) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({});
        }, seconds * 1000);
    });
});
//# sourceMappingURL=test-wallet.js.map