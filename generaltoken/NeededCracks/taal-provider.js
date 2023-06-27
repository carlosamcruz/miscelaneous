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
exports.TaalProvider = void 0;
const scryptlib_1 = require("scryptlib");
const abstract_provider_1 = require("../bsv/abstract-provider");
const whatsonchain_provider_1 = require("./whatsonchain-provider");
const superagent = require('superagent');
/**
 * The TaalProvider is backed by [taal]{@link https://console.taal.com/},
 * which is the popular blockchain exxplorer for Bitcoin.
 */
class TaalProvider extends abstract_provider_1.Provider {
    constructor(apiKey = 'testnet_4df8757e4c289af199f69ad759be31b4') {
        super();
        this.apiKey = apiKey;
        this._network = scryptlib_1.bsv.Networks.testnet;
        if (this.apiKey.startsWith('testnet_')) {
            this._network = scryptlib_1.bsv.Networks.testnet;
        }
        else {
            this._network = scryptlib_1.bsv.Networks.mainnet;
        }
        this._provider = new whatsonchain_provider_1.WhatsonchainProvider(this._network);
    }
    get apiPrefix() {
        return `https://api.taal.com/api/v1/broadcast`;
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
                const res = yield superagent.post('https://api.taal.com/api/v1/broadcast')
                    .timeout({
                    response: timeout,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                    .set('Content-Type', 'application/octet-stream')
                    .set('Authorization', this.apiKey)
                    .send(Buffer.from(rawTxHex, 'hex'));
                return res.text;
            }
            catch (error) {
                throw new Error(`TaalProvider ERROR: ${error.message}`);
            }
        });
    }
    */

    //////////////////////// 
    // Jesus is The Lord
    ////////////////////////

    sendRawTransaction(rawTxHex) {
        //console.log('Using Taal ')
        return __awaiter(this, void 0, void 0, function* () {
            // 1 second per KB
            const size = Math.max(1, rawTxHex.length / 2 / 1024); //KB
            //const timeout = Math.max(10000, 1000 * size); //Original
            const timeout = Math.max(100000, 10000 * size);
            try {
                //const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast/multipart`)
                const res = yield superagent.post('https://api.taal.com/api/v1/broadcast')
                    .timeout({
                    response: timeout,
                    deadline: 5*60000, // but allow 1 minute for the file to finish loading.
                })
                    .set('Content-Type', 'application/octet-stream')
                    .set('Authorization', this.apiKey)
                    .send(Buffer.from(rawTxHex, 'hex'));

                console.log('New Check: ', res.text)
    
                return res.text;
            }
            catch (error) {
                throw new Error(`TaalProvider ERROR: ${error.message}`);
            }
        });
    }


    listUnspent(address, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._provider.listUnspent(address, options);
        });
    }
    getBalance(address) {
        return this._provider.getBalance(address);
    }
    getTransaction(txHash) {
        return this._provider.getTransaction(txHash);
    }
    getFeePerKb() {
        return Promise.resolve(50);
    }
}
exports.TaalProvider = TaalProvider;
//# sourceMappingURL=taal-provider.js.map