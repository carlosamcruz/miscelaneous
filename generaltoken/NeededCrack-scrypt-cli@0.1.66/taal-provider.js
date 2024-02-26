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
        this._feePerKb = 1;
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
        return this._provider.isConnected();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //////////////////////// 
                // Jesus is The Lord
                ////////////////////////

                //yield this._provider.connect();
                //yield this._updateFeePerKb();

                this.emit("connected" /* ProviderEvent.Connected */, true);
            }
            catch (error) {
                yield this._provider.connect();
                this.emit("connected" /* ProviderEvent.Connected */, false);
            }
            return Promise.resolve(this);
        });
    }
    updateNetwork(network) {
        this._network = network;
        this.emit("networkChange" /* ProviderEvent.NetworkChange */, network);
    }
    getNetwork() {
        return this._network;
    }

    /*
    sendRawTransaction(rawTxHex) {
        var _a, _b, _c;
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
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.type) === "application/json" && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.body)) {
                    throw new Error(`TaalProvider ERROR: ${JSON.stringify((_c = error.response) === null || _c === void 0 ? void 0 : _c.body)}`);
                }
                throw new Error(`TaalProvider ERROR: ${error.message}`);
            }
        });
    }
    */

    //////////////////////// 
    // Jesus is The Lord
    ////////////////////////
/*
    sendRawTransaction(rawTxHex) {
        //console.log('Using Taal ')
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // 1 second per KB
            const size = Math.max(1, rawTxHex.length / 2 / 1024); //KB
            //const timeout = Math.max(10000, 1000 * size); //Original
            const timeout = Math.max(100000, 10000 * size);
            try {
                //const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast/multipart`)
                //const res = yield superagent.post('https://api.taal.com/api/v1/broadcast')
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
            
            //catch (error) {
            //    throw new Error(`TaalProvider ERROR: ${error.message}`);
            //}
            catch (error) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.type) === "application/json" && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.body)) {
                  //  throw new Error(`TaalProvider ERROR: ${JSON.stringify((_c = error.response) === null || _c === void 0 ? void 0 : _c.body)}`);
                }
                //throw new Error(`TaalProvider ERROR: ${error.message}`);
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
           
            /*
            console.log('TxId send BE: ', scryptlib_1.hash256(scryptlib_1.toHex(rawTxHex)))
            console.log('TxId send LE: ', scryptlib_1.bsv.Transaction(rawTxHex).id)
            //console.log('Raw TX: ', (scryptlib_1.toHex(rawTxHex)))

            let toPost;

            if(this._network.name === scryptlib_1.bsv.Networks.mainnet.name)
            {
                toPost = 'https://api.bitails.io/tx/broadcast/multipart'
                //toPost = 'https://api.bitails.io/tx/broadcast'
                //toPost = 'https://api.bitails.io/tx/broadcast/multi'
            }
            else
            {
                toPost = `https://test-api.bitails.io/tx/broadcast/multipart` 
            }
    

            try {
                //'https://api.bitails.io/tx/broadcast';
                //'https://test-api.bitails.io/tx/broadcast';
                //'https://api.bitails.io/tx/broadcast/multipart'
                //'https://test-api.bitails.io/tx/broadcast/multipart'
                //`https://api.whatsonchain.com/v1/bsv/${networkStr}`;
                //const res = yield superagent_1.default.post(`${this.apiPrefix}/tx/raw`)
                //const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast`)
                //const res = yield superagent_1.default.post(`https://test-api.bitails.io/tx/broadcast/multipart`)
                
                console.log('Before Broadcast: ')

                const formData = new FormData();

                formData.append('raw', new Blob([Buffer.from(rawTxHex, 'hex')]));
                formData.append('filename', 'raw');
    
                const res = yield superagent_1.default.post(toPost)
                    .timeout({
                    response: timeout,
                    deadline: 5*60000, // but allow 1 minute for the file to finish loading.
                })
                    //.set('Content-Type', 'application/json')
                    //.send({ txhex: rawTxHex });
                    //.send({raws : rawTxHex});
                    //.send({raw : rawTxHex});
                    .send(formData)

                console.log('Res Body: ', res.body)
    
                return res.body.txid;
                
            }
            catch (error) {
                if (error.response && error.response.text) {

                    //console.log('Error response: ', error.response)
                    //console.log('Error message: ', error.message)
                    //console.log('Error response Text: ', error.response.text)

                    if (needIgnoreError(error.response.text)) {
                        console.log("ignoring2")
                        return new scryptlib_1.bsv.Transaction(rawTxHex).id;
                    }

                    else if (error.response.text.includes('Unhandled Error')){

                        console.log("ignoring2")

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

            */
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
        //return Promise.resolve(1);

        return Promise.resolve(this._feePerKb);
    }
    _updateFeePerKb() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield superagent.get('https://api.taal.com/mapi/feeQuote')
                    .timeout({
                    response: 5000,
                    deadline: 10000,
                })
                    .set('Authorization', this.apiKey);
                const resp = JSON.parse(res.body.payload);
                resp.fees.forEach(element => {
                    if (element.feeType == 'standard') {
                        this._feePerKb = (element.miningFee.satoshis * 1000) / element.miningFee.bytes;
                    }
                });
            }
            catch (error) {
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.type) === "application/json" && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.body)) {
                    throw new Error(`TaalProvider ERROR: ${JSON.stringify((_c = error.response) === null || _c === void 0 ? void 0 : _c.body)}`);
                }
                throw new Error(`TaalProvider ERROR: ${error.message}`);
            }
        });


    }
}
exports.TaalProvider = TaalProvider;
//# sourceMappingURL=taal-provider.js.map