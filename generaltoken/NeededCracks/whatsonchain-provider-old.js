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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsonchainProvider = void 0;
const scryptlib_1 = require("scryptlib");
const abstract_provider_1 = require("../bsv/abstract-provider");
const superagent_1 = __importDefault(require("superagent"));
const utils_1 = require("../bsv/utils");
/**
 * The WhatsonchainProvider is backed by [whatsonchain]{@link https://whatsonchain.com},
 * which is the popular blockchain exxplorer for Bitcoin.
 */
class WhatsonchainProvider extends abstract_provider_1.Provider {
    constructor(network) {
        super();
        this._network = network;
    }
    get apiPrefix() {
        // TODO: check all avaiable networks
        const networkStr = this._network.name === scryptlib_1.bsv.Networks.mainnet.name ? 'main' : 'test';
        return `https://api.whatsonchain.com/v1/bsv/${networkStr}`;
    }

    //////////////////////// 
    // Jesus is The Lord
    ////////////////////////
    //Para o caso de uso da Bitails
    get apiPrefixWhich() {
        //'https://api.bitails.io/tx/broadcast';
        //'https://test-api.bitails.io/tx/broadcast';
        //'https://api.bitails.io/tx/broadcast/multipart'
        //'https://test-api.bitails.io/tx/broadcast/multipart'
        //`https://api.whatsonchain.com/v1/bsv/${networkStr}`;

        // TODO: check all avaiable networks
        //const networkStr = this._network.name === scryptlib_1.bsv.Networks.mainnet.name ? 'main' : 'test';
        //return `https://api.whatsonchain.com/v1/bsv/${networkStr}`;
        return `https://test-api.bitails.io/tx/broadcast/multipart`;
    }


    isConnected() {
        return true;
    }
    connect() {
        this.emit(abstract_provider_1.ProviderEvent.Connected, true);
        return Promise.resolve(this);
    }
    updateNetwork(network) {
        this._network = network;
        this.emit(abstract_provider_1.ProviderEvent.NetworkChange, network);
    }
    getNetwork() {
        return this._network;
    }

    //Original
    /*
    sendRawTransaction(rawTxHex) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1 second per KB
            const size = Math.max(1, rawTxHex.length / 2 / 1024); //KB
            const timeout = Math.max(10000, 1000 * size);
            try {
                const res = yield superagent_1.default.post(`${this.apiPrefix}/tx/raw`)
                    .timeout({
                    response: timeout,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                    .set('Content-Type', 'application/json')
                    .send({ txhex: rawTxHex });
                return res.body;
            }
            catch (error) {
                if (error.response && error.response.text) {
                    if (needIgnoreError(error.response.text)) {
                        return new scryptlib_1.bsv.Transaction(rawTxHex).id;
                    }
                    throw new Error(`WhatsonchainProvider ERROR: ${friendlyBIP22RejectionMsg(error.response.text)}`);
                }
                throw new Error(`WhatsonchainProvider ERROR: ${error.message}`);
            }
        });
    }
    */

    //////////////////////// 
    // Jesus is The Lord
    ////////////////////////

    sendRawTransaction(rawTxHex) {
        return __awaiter(this, void 0, void 0, function* () {

            //console.log('Using WOC ')
            // 1 second per KB
            const size = Math.max(1, rawTxHex.length / 2 / 1024); //KB
            //const timeout = Math.max(10000, 1000 * size);
            const timeout = Math.max(100000, 10000 * size);
           
            console.log('TxId send BE: ', scryptlib_1.hash256(scryptlib_1.toHex(rawTxHex)))
            console.log('TxId send LE: ', scryptlib_1.bsv.Transaction(rawTxHex).id)
            //console.log('Raw TX: ', (scryptlib_1.toHex(rawTxHex)))

            try {
                //'https://api.bitails.io/tx/broadcast';
                //'https://test-api.bitails.io/tx/broadcast';
                //'https://api.bitails.io/tx/broadcast/multipart'
                //'https://test-api.bitails.io/tx/broadcast/multipart'
                //`https://api.whatsonchain.com/v1/bsv/${networkStr}`;
                //const res = yield superagent_1.default.post(`${this.apiPrefix}/tx/raw`)
                //const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast`)
                const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast/multipart`)
                    .timeout({
                    response: timeout,
                    deadline: 5*60000, // but allow 1 minute for the file to finish loading.
                })
                    .set('Content-Type', 'application/json')
                    .send({ txhex: rawTxHex });

                //console.log('Res Body: ', res.body)
    
                return res.body;
            }
            catch (error) {
                if (error.response && error.response.text) {

                    //console.log('Error response: ', error.response)
                    //console.log('Error message: ', error.message)
                    //console.log('Error response Text: ', error.response.text)

                    if (needIgnoreError(error.response.text)) {
                        return new scryptlib_1.bsv.Transaction(rawTxHex).id;
                    }

                    else if (error.response.text.includes('Unhandled Error')){

                        if((scryptlib_1.toHex(rawTxHex)).length > 2000000)
                        {
                            console.log('\nFor Big Data TX Check if it can be found at:')      
                            //console.log('WoC: https://test.whatsonchain.com/')      
                            console.log('Bitails: https://test-mapi.bitails.io/swagger#/Merchant%20Api/MapiApiController_transactionStatus')
                            console.log('Or Wait until the Confirmation of the Next Block\n')    
                        }

                        return new scryptlib_1.bsv.Transaction(rawTxHex).id;
                    }
                    else{
                        throw new Error(`WhatsonchainProvider ERROR 1: ${friendlyBIP22RejectionMsg(error.response.text)}`);
                    }
                    
                }
                throw new Error(`WhatsonchainProvider ERROR 2: ${error.message}`);
            }
        });
    }

    listUnspent(address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield superagent_1.default.get(`${this.apiPrefix}/address/${address}/unspent`);
            let utxos = res.body.map(item => ({
                txId: item.tx_hash,
                outputIndex: item.tx_pos,
                satoshis: item.value,
                script: scryptlib_1.bsv.Script.buildPublicKeyHashOut(address).toHex(),
            }));
            if (options) {
                return (0, utils_1.filterUTXO)(utxos, options);
            }
            return utxos;
        });
    }
    getBalance(address) {
        return this.listUnspent(address).then(utxos => {
            return {
                confirmed: utxos.reduce((acc, utxo) => {
                    acc += utxo.satoshis;
                    return acc;
                }, 0),
                unconfirmed: 0
            };
        });
    }
    getTransaction(txHash) {
        return superagent_1.default.get(`${this.apiPrefix}/tx/${txHash}/hex`).then(res => {
            if (res.ok) {
                return new scryptlib_1.bsv.Transaction(res.text);
            }
            else if (res.error) {
                throw res.error;
            }
            else {
                throw `getTransaction error ${txHash}`;
            }
        });
    }
    getFeePerKb() {
        return Promise.resolve(50);
    }
}
exports.WhatsonchainProvider = WhatsonchainProvider;
//Original
/*
function needIgnoreError(inMsg) {
    if (inMsg.includes('Transaction already in the mempool')) {
        return true;
    }
    else if (inMsg.includes('txn-already-known')) {
        return true;
    }
    return false;
}
*/

//////////////////////// 
// Jesus is The Lord
////////////////////////
function needIgnoreError(inMsg) {
    if (inMsg.includes('Transaction already in the mempool')) {
        return true;
    }
    else if (inMsg.includes('txn-already-known')) {
        return true;
    }
    //No caso de uso da Bitails
    //else if (`${this.apiPrefixWhich}`.includes('api.bitails.io') && inMsg.includes('"statusCode":500,"timestamp":')){
        
    //else if (inMsg.includes('"statusCode":500,"timestamp":')){
      
    /*
    else if (inMsg.includes('Unhandled Error')){      
        console.log('Check TX status at Bitails: https://test-mapi.bitails.io/swagger#/Merchant%20Api/MapiApiController_transactionStatus ')
        return true;
    }
    */
    
    
    return false;
}


function friendlyBIP22RejectionMsg(inMsg) {
    if (inMsg.includes('bad-txns-vin-empty')) {
        return 'Transaction is missing inputs.';
    }
    else if (inMsg.includes('bad-txns-vout-empty')) {
        return 'Transaction is missing outputs.';
    }
    else if (inMsg.includes('bad-txns-oversize')) {
        return 'Transaction is too large.';
    }
    else if (inMsg.includes('bad-txns-vout-negative')) {
        return 'Transaction output value is negative.';
    }
    else if (inMsg.includes('bad-txns-vout-toolarge')) {
        return 'Transaction outputut value is too large.';
    }
    else if (inMsg.includes('bad-txns-txouttotal-toolarge')) {
        return 'Transaction total outputut value is too large.';
    }
    else if (inMsg.includes('bad-txns-prevout-null')) {
        return 'Transaction inputs previous TX reference is null.';
    }
    else if (inMsg.includes('bad-txns-inputs-duplicate')) {
        return 'Transaction contains duplicate inputs.';
    }
    else if (inMsg.includes('bad-txns-inputs-too-large')) {
        return 'Transaction inputs too large.';
    }
    else if (inMsg.includes('bad-txns-fee-negative')) {
        return 'Transaction network fee is negative.';
    }
    else if (inMsg.includes('bad-txns-fee-outofrange')) {
        return 'Transaction network fee is out of range.';
    }
    else if (inMsg.includes('mandatory-script-verify-flag-failed')) {
        return 'Script evaluation failed.';
    }
    else {
        return inMsg;
    }
}
//# sourceMappingURL=whatsonchain-provider.js.map