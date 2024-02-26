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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRate = exports.scriptHistoryUnc = exports.scriptHistory = exports.getSpentOutput = exports.getTransaction = exports.listUnspentConfWOC = exports.listUnspentUnconfWOC = exports.listUnspent = exports.broadcast = void 0;
//export let pvtkey: string = '';
var scrypt_ts_1 = require("scrypt-ts");
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API atualizada 
//////////////////////////////////////////////////////////////////////////////////////////
function broadcast(tx, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, TxHexBsv, urlAdress01, urlAdress02, urlAdress03, urlAdress04, txID, url, TXJson, bcFinish, cycle, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 3;
                    npools = 4;
                    TxHexBsv = tx;
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/tx/raw';
                    urlAdress02 = 'https://mapi.gorillapool.io/mapi/tx';
                    urlAdress03 = 'https://api.bitails.io/tx/broadcast';
                    urlAdress04 = 'https://api.bitails.io/tx/broadcast/multipart';
                    txID = new scrypt_ts_1.bsv.Transaction(tx).id;
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/raw';
                        urlAdress02 = 'https://testnet-mapi.gorillapool.io/mapi/tx';
                        urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    }
                    console.log('pool id', poolID);
                    bcFinish = false;
                    cycle = 0;
                    _loop_1 = function () {
                        var resp_1, formData, response, e_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    switch (poolID) {
                                        case 0:
                                            url = new URL(urlAdress01);
                                            TXJson = "{\"txhex\": \"".concat(TxHexBsv, "\" }");
                                            break;
                                        case 1:
                                            url = new URL(urlAdress02);
                                            TXJson = "{\"rawTx\": \"".concat(TxHexBsv, "\" }");
                                            break;
                                        case 2:
                                            url = new URL(urlAdress03);
                                            TXJson = "{\"raw\": \"".concat(TxHexBsv, "\" }");
                                            break;
                                        default:
                                            url = new URL(urlAdress04);
                                            TXJson = "{\"raw\": \"".concat(TxHexBsv, "\" }");
                                            break;
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, , 7]);
                                    console.log('URL', url);
                                    resp_1 = '';
                                    if (!(poolID === 3)) return [3 /*break*/, 3];
                                    formData = new FormData();
                                    formData.append('raw', new Blob([Buffer.from(TxHexBsv, 'hex')]));
                                    formData.append('filename', 'raw');
                                    return [4 /*yield*/, fetch(url, {
                                            method: 'POST',
                                            //body: content,
                                            body: formData,
                                            //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}             
                                        }).then(function (response) { return response.text(); }) //then(response=>response.json())
                                            .then(function (data) {
                                            resp_1 = data;
                                            //console.log(data); 
                                        })];
                                case 2:
                                    response = _b.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, fetch(url, {
                                        method: 'POST',
                                        //body: content,
                                        body: TXJson,
                                        //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} 
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'accept': 'text/plain'
                                        }
                                    }).then(function (response) { return response.text(); }) //then(response=>response.json())
                                        .then(function (data) {
                                        resp_1 = data;
                                        //console.log(data); 
                                    })];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    if (resp_1.indexOf(txID) !== -1) {
                                        //console.log('Success: ', resp);
                                        bcFinish = true;
                                    }
                                    else {
                                        bcFinish = false;
                                        console.log('Not Success: ', resp_1);
                                    }
                                    return [3 /*break*/, 7];
                                case 6:
                                    e_1 = _b.sent();
                                    console.error(e_1);
                                    return [3 /*break*/, 7];
                                case 7:
                                    cycle++;
                                    poolID++;
                                    poolID = poolID % npools;
                                    console.log('Pool id: ', poolID);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    if (bcFinish) {
                        return [2 /*return*/, txID];
                    }
                    else {
                        return [2 /*return*/, ''];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.broadcast = broadcast;
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API planejada para ser descontinuada
// **************** Atualizar 
//////////////////////////////////////////////////////////////////////////////////////////
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function listUnspent(addOrScriptHash, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, UTXOconf, UTXOunconf, size1, utxos_1, i, i, urlAdress01, urlAdress02, url, resp, bcFinish, cycle, utxoScript, utxos, res, res_1, res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 2;
                    if (!(poolID === 1000)) return [3 /*break*/, 3];
                    return [4 /*yield*/, listUnspentConfWOC(addOrScriptHash, homenetwork)];
                case 1:
                    UTXOconf = _a.sent();
                    return [4 /*yield*/, listUnspentUnconfWOC(addOrScriptHash, homenetwork)];
                case 2:
                    UTXOunconf = _a.sent();
                    size1 = 0;
                    size1 = UTXOconf.length;
                    utxos_1 = [];
                    for (i = 0; i < UTXOconf.length; i++) {
                        if (UTXOconf[i].outputIndex > -1) {
                            utxos_1.push(UTXOconf[i]);
                        }
                    }
                    for (i = 0; i < UTXOunconf.length; i++) {
                        if (UTXOunconf[i].outputIndex > -1) {
                            utxos_1.push(UTXOunconf[i]);
                        }
                    }
                    console.log('Conf UTXOs: ', UTXOconf);
                    console.log('Unconf UTXOs: ', UTXOunconf);
                    console.log('UTXOs: ', utxos_1);
                    return [2 /*return*/, utxos_1];
                case 3:
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/address/';
                    urlAdress02 = 'https://api.bitails.io/address/';
                    if (addOrScriptHash.length === 64) {
                        console.log('Hash Length: ', addOrScriptHash.length);
                        //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                        //Returns a response as long as the response message is less than 1MB in size.
                        //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
                        urlAdress02 = 'https://api.bitails.io/scripthash/';
                        //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    }
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
                        urlAdress02 = 'https://test-api.bitails.io/address/';
                        if (addOrScriptHash.length === 64) {
                            //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                            //Returns a response as long as the response message is less than 1MB in size.
                            //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                            urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
                            urlAdress02 = 'https://test-api.bitails.io/scripthash/';
                            //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                            //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                        }
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    utxoScript = '';
                    if (addOrScriptHash.length !== 64) {
                        utxoScript = scrypt_ts_1.bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex();
                    }
                    _a.label = 4;
                case 4:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 9];
                    switch (poolID) {
                        case 0:
                            url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                            //TXJson = `{"txhex": "${TxHexBsv}" }`; 
                            break;
                        default:
                            url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                            //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                            break;
                    }
                    console.log('URL', url);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 6:
                    _a.sent();
                    if (resp.indexOf('[]') !== -1 || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1) {
                        //console.log('Success: ', resp);
                        bcFinish = true;
                        res = JSON.parse(resp);
                        if (resp.indexOf('[]') !== -1) {
                            res_1 = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                            utxos = res_1.map(function (item) { return ({
                                height: item.height,
                                time: -2,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else if (poolID == 0) {
                            //utxos = res.body.map((item: any) => ({
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                time: -1,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else {
                            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1));
                            utxos = res.map(function (item) { return ({
                                //utxos = res.body.map((item: any) => ({
                                height: -1,
                                time: item.time,
                                txId: item.txid,
                                outputIndex: item.vout,
                                satoshis: item.satoshis,
                                script: utxoScript,
                            }); });
                        }
                        //console.log("UTXO: ", utxos)
                    }
                    else {
                        bcFinish = false;
                        res = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                        utxos = res.map(function (item) { return ({
                            height: item.height,
                            time: -2,
                            txId: item.tx_hash,
                            outputIndex: item.tx_pos,
                            satoshis: item.value,
                            script: '',
                        }); });
                    }
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 8];
                case 8:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 4];
                case 9:
                    console.log('UTXOs: ', utxos);
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, utxos];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, utxos];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.listUnspent = listUnspent;
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function listUnspentUnconfWOC(addOrScriptHash, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, urlAdress01, url, resp, bcFinish, cycle, utxoScript, utxos, res, res_2, res, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 1;
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/address/';
                    //let urlAdress02: string = 'https://api.bitails.io/address/';
                    if (addOrScriptHash.length === 64) {
                        console.log('Hash Length: ', addOrScriptHash.length);
                        //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                        //Returns a response as long as the response message is less than 1MB in size.
                        //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
                        //urlAdress02 = 'https://api.bitails.io/scripthash/';
                        //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    }
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
                        //urlAdress02 = 'https://test-api.bitails.io/address/';
                        if (addOrScriptHash.length === 64) {
                            //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                            //Returns a response as long as the response message is less than 1MB in size.
                            //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                            urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
                            //urlAdress02 = 'https://test-api.bitails.io/scripthash/';
                            //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                            //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                        }
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    utxoScript = '';
                    if (addOrScriptHash.length !== 64) {
                        utxoScript = scrypt_ts_1.bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex();
                    }
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    //url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                    url = new URL(urlAdress01 + addOrScriptHash + '/unconfirmed/unspent');
                    /*
                    switch(poolID)
                    {
                      case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                              //TXJson = `{"txhex": "${TxHexBsv}" }`;
                        break;
                      default: url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                              //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                        break;
                    }
                    */
                    console.log('URL', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    if (resp.indexOf('[]') !== -1 || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1) {
                        //console.log('Success: ', resp);
                        bcFinish = true;
                        res = JSON.parse(resp);
                        if (resp.indexOf('[]') !== -1) {
                            res_2 = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                            utxos = res_2.map(function (item) { return ({
                                height: item.height,
                                time: -2,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else if (poolID == 0) {
                            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1)); //Nova WoC
                            //utxos = res.body.map((item: any) => ({
                            utxos = res.map(function (item) { return ({
                                height: 0,
                                time: -1,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else {
                            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1));
                            utxos = res.map(function (item) { return ({
                                //utxos = res.body.map((item: any) => ({
                                height: -1,
                                time: item.time,
                                txId: item.txid,
                                outputIndex: item.vout,
                                satoshis: item.satoshis,
                                script: utxoScript,
                            }); });
                        }
                        //console.log("UTXO: ", utxos)
                    }
                    else {
                        bcFinish = false;
                        res = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                        utxos = res.map(function (item) { return ({
                            height: item.height,
                            time: -2,
                            txId: item.tx_hash,
                            outputIndex: item.tx_pos,
                            satoshis: item.value,
                            script: '',
                        }); });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    console.error(e_3);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, utxos];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, utxos];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.listUnspentUnconfWOC = listUnspentUnconfWOC;
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function listUnspentConfWOC(addOrScriptHash, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, urlAdress01, url, resp, bcFinish, cycle, utxoScript, utxos, res, res_3, res, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 1;
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/address/';
                    //let urlAdress02: string = 'https://api.bitails.io/address/';
                    if (addOrScriptHash.length === 64) {
                        console.log('Hash Length: ', addOrScriptHash.length);
                        //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                        //Returns a response as long as the response message is less than 1MB in size.
                        //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
                        //urlAdress02 = 'https://api.bitails.io/scripthash/';
                        //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    }
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
                        //urlAdress02 = 'https://test-api.bitails.io/address/';
                        if (addOrScriptHash.length === 64) {
                            //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                            //Returns a response as long as the response message is less than 1MB in size.
                            //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                            urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
                            //urlAdress02 = 'https://test-api.bitails.io/scripthash/';
                            //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                            //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                        }
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    utxoScript = '';
                    if (addOrScriptHash.length !== 64) {
                        utxoScript = scrypt_ts_1.bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex();
                    }
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    //url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                    url = new URL(urlAdress01 + addOrScriptHash + '/confirmed/unspent');
                    /*
                    switch(poolID)
                    {
                      case 0: url = new URL(urlAdress01 + addOrScriptHash + '/unspent');
                              //TXJson = `{"txhex": "${TxHexBsv}" }`;
                        break;
                      default: url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                              //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                        break;
                    }
                    */
                    console.log('URL', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    if (resp.indexOf('[]') !== -1 || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1) {
                        //console.log('Success: ', resp);
                        bcFinish = true;
                        res = JSON.parse(resp);
                        if (resp.indexOf('[]') !== -1) {
                            res_3 = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                            utxos = res_3.map(function (item) { return ({
                                height: item.height,
                                time: -2,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else if (poolID == 0) {
                            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1)); //Nova WoC
                            //utxos = res.body.map((item: any) => ({
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                time: -1,
                                txId: item.tx_hash,
                                outputIndex: item.tx_pos,
                                satoshis: item.value,
                                script: utxoScript,
                            }); });
                        }
                        else {
                            res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1));
                            utxos = res.map(function (item) { return ({
                                //utxos = res.body.map((item: any) => ({
                                height: -1,
                                time: item.time,
                                txId: item.txid,
                                outputIndex: item.vout,
                                satoshis: item.satoshis,
                                script: utxoScript,
                            }); });
                        }
                        //console.log("UTXO: ", utxos)
                    }
                    else {
                        bcFinish = false;
                        res = JSON.parse('[{"height":-2,"tx_pos":-1,"tx_hash":"","value":0}]');
                        utxos = res.map(function (item) { return ({
                            height: item.height,
                            time: -2,
                            txId: item.tx_hash,
                            outputIndex: item.tx_pos,
                            satoshis: item.value,
                            script: '',
                        }); });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    console.error(e_4);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, utxos];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, utxos];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.listUnspentConfWOC = listUnspentConfWOC;
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API atualizada 
//////////////////////////////////////////////////////////////////////////////////////////
function getTransaction(txid, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, urlAdress01, urlAdress02, url, resp, bcFinish, cycle, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 2;
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid + '/hex';
                    urlAdress02 = 'https://api.bitails.io/download/tx/' + txid;
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/hex';
                        urlAdress02 = 'https://test-api.bitails.io/download/tx/' + txid;
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 9];
                    switch (poolID) {
                        case 0:
                            url = new URL(urlAdress01);
                            //TXJson = `{"txhex": "${TxHexBsv}" }`; 
                            break;
                        default:
                            url = new URL(urlAdress02);
                            //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                            break;
                    }
                    console.log('URL ABCDEF', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    console.log('URL', url);
                    if (!(poolID === 1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetch(url)
                            //.then(response => response.text())
                            .then(function (response) { return response.arrayBuffer(); })
                            .then(function (data) {
                            //let dataHEX: number[] = [data.byteLength];
                            var view = new DataView(data); //Para visualizar o Dado do ArrayBuffer
                            var dataHEX = [data.byteLength];
                            for (var i = 0; i < data.byteLength; i++) {
                                dataHEX[i] = view.getUint8(i);
                            }
                            //postMessage(dataHEX);
                            //resp = convertBinaryToHexString(dataHEX);
                            resp = dataHEX.map(function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
                            console.log('BITAILS TX: ', resp);
                            //console.log("\n\nChar:", SHA256G.ByteToStrHex(dataHEX)); //não pode ser usada neste contexto;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, fetch(url)
                        .then(function (response) { return response.text(); })
                        .then(function (data) {
                        //postMessage(data);
                        // Use the data from the response here
                        resp = data;
                    })
                        .catch(function (error) {
                        //console.error(error);
                        //postMessage(0);
                        resp = '';
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    //postMessage(dataHEX);
                    if (resp.length > 0) {
                        //console.log('Success: ', resp);
                        bcFinish = true;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    e_5 = _a.sent();
                    console.error(e_5);
                    return [3 /*break*/, 8];
                case 8:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 9:
                    if (bcFinish) {
                        return [2 /*return*/, resp
                            //return utxos
                        ];
                        //return utxos
                    }
                    else {
                        return [2 /*return*/, ''
                            //return utxos
                        ];
                        //return utxos
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getTransaction = getTransaction;
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: API nova, sem planos para descontinuidade
//////////////////////////////////////////////////////////////////////////////////////////
//export async function getSpentOutput(txid: any, vout: number, homenetwork: any): Promise <string>
function getSpentOutput(txid, vout, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, position, stxo, urlAdress01, url, resp, bcFinish, cycle, res, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 1;
                    position = vout.toString();
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid + '/' + position + '/spent';
                    //let urlAdress02: string = 'https://api.bitails.io/download/tx/' + txid;
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/' + position + '/spent';
                        //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/' + txid + '/hex';
                        //urlAdress02 = 'https://test-api.bitails.io/download/tx/' + txid;
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    switch (poolID) {
                        default:
                            url = new URL(urlAdress01);
                            //TXJson = `{"txhex": "${TxHexBsv}" }`; 
                            break;
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    /////////////////////////////////////////////////
                    //JESUS is the LORD!!!
                    /////////////////////////////////////////////////
                    //Using WoC
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            // Use the data from the response here
                            resp = data;
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            //resp = '';
                            resp = error;
                        })];
                case 3:
                    /////////////////////////////////////////////////
                    //JESUS is the LORD!!!
                    /////////////////////////////////////////////////
                    //Using WoC
                    _a.sent();
                    //postMessage(dataHEX);
                    if (resp.length > 0) {
                        //console.log('Success: ', resp);
                        bcFinish = true;
                        if (resp.indexOf('txid') !== -1) {
                            res = JSON.parse('[' + resp + ']');
                            stxo = res.map(function (item) { return ({
                                //utxos = res.body.map((item: any) => ({
                                txId: item.txid,
                                inputIndex: item.vin,
                            }); });
                        }
                        else {
                            stxo = [{
                                    //utxos = res.body.map((item: any) => ({
                                    txId: '',
                                    inputIndex: -1,
                                }];
                        }
                        console.log('STXO: ', stxo);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_6 = _a.sent();
                    console.error(e_6);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        //return resp
                        //return utxos
                        return [2 /*return*/, stxo];
                    }
                    else {
                        //return ''
                        //return utxos
                        return [2 /*return*/, stxo];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getSpentOutput = getSpentOutput;
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: Usando novo modelo de API WOC, completar com Bitails
//////////////////////////////////////////////////////////////////////////////////////////
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function scriptHistory(addOrScriptHash, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, urlAdress01, urlAdress02, url, resp, bcFinish, cycle, utxoScript, utxos, res, index0, jsonSTR, res, res, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 1 // somente WoC por enquanto
                    ;
                    //https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
                    //https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
                    //let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
                    //let urlAdress02: string = 'https://api.bitails.io/address/';
                    //if(addOrScriptHash.length === 64)
                    //{
                    console.log('Hash Length: ', addOrScriptHash.length);
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
                    urlAdress02 = 'https://api.bitails.io/scripthash/';
                    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    //}
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
                        //urlAdress02 = 'https://test-api.bitails.io/address/';
                        //if(addOrScriptHash.length === 64)
                        //{
                        //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                        //Returns a response as long as the response message is less than 1MB in size.
                        //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
                        urlAdress02 = 'https://test-api.bitails.io/scripthash/';
                        //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                        //}  
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    utxoScript = '';
                    if (addOrScriptHash.length !== 64) {
                        utxoScript = scrypt_ts_1.bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex();
                    }
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    switch (poolID) {
                        case 0:
                            url = new URL(urlAdress01 + addOrScriptHash + '/confirmed/history');
                            //TXJson = `{"txhex": "${TxHexBsv}" }`; 
                            break;
                        default:
                            url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                            //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                            break;
                    }
                    console.log('URL', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
                    if (resp.indexOf('Not Found') !== -1 || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1) {
                        console.log('Success: ', resp);
                        bcFinish = true;
                        /*
                        console.log('resp Length: ', resp.length)
                        console.log('index "result": ', resp.indexOf('"result":'))
                        console.log('index "error": ', resp.indexOf(',"error"'))
                        let index0 = resp.indexOf('"result":');
                        let index1 = resp.indexOf(',"error"');
                        console.log('index Index0: ', index0)
                        console.log('index Index0: ', index1)
              
                        //console.log('res: ', resp.substring(index0 + 9, resp.length - index1));
                        console.log('res: ', resp.substring(0, resp.length));
                        console.log('res: ', resp.substring(77 + 9, resp.length - 177));
              
                        console.log('res: ', resp.substring(index0 + 9, resp.length - (resp.length - index1)));
                        */
                        //let res = JSON.parse(resp);
                        //{"result":
                        if (resp.indexOf('Not Found') !== -1) {
                            res = JSON.parse('[{"tx_hash":"","height":-2}]');
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                txId: item.tx_hash,
                            }); });
                        }
                        else //if(poolID == 0)
                         {
                            index0 = resp.indexOf('"result":[');
                            jsonSTR = resp.substring(index0 + 9, resp.length);
                            jsonSTR = jsonSTR.substring(0, jsonSTR.indexOf(']') + 1);
                            console.log('res: ', resp.substring(resp.indexOf('"result":[') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
                            console.log('jsonSTR: ', jsonSTR);
                            res = JSON.parse(jsonSTR);
                            console.log('res: ', res);
                            //utxos = res.body.map((item: any) => ({
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                txId: item.tx_hash,
                            }); });
                        }
                        /*
                        else
                        {
                          res = JSON.parse(resp.substring(resp.indexOf('['), resp.indexOf(']') + 1));
                          utxos = res.map((item: any) => ({
                          //utxos = res.body.map((item: any) => ({
                            height: -1,
                            time: item.time,
                            txId: item.txid,
                            outputIndex: item.vout,
                            satoshis: item.satoshis,
                            script: utxoScript,
                          }));
                        }
                        */
                        //console.log("UTXO: ", utxos)
                    }
                    else {
                        bcFinish = false;
                        res = JSON.parse('[{"tx_hash":"","height":-2}]');
                        utxos = res.map(function (item) { return ({
                            height: item.height,
                            //time: -2,
                            txId: item.tx_hash,
                            //outputIndex: item.tx_pos,
                            //satoshis: item.value,
                            //script: '',
                        }); });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_7 = _a.sent();
                    console.error(e_7);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, utxos];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, utxos];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.scriptHistory = scriptHistory;
//////////////////////////////////////////////////////////////////////////////////////////
// Jesus is the Lord
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// OBS: Usando novo modelo de API WOC, completar com Bitails
//////////////////////////////////////////////////////////////////////////////////////////
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function scriptHistoryUnc(addOrScriptHash, homenetwork) {
    return __awaiter(this, void 0, void 0, function () {
        var poolID, npools, urlAdress01, urlAdress02, url, resp, bcFinish, cycle, utxoScript, utxos, res, index0, jsonSTR, res, res, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolID = 0;
                    npools = 1 // somente WoC por enquanto
                    ;
                    //https://api.whatsonchain.com/v1/bsv/main/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
                    //https://api.bitails.io/address/12XFn6p1H831shGhbd1UobrVqXFEpCBTPp/unspent
                    //let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/address/';
                    //let urlAdress02: string = 'https://api.bitails.io/address/';
                    //if(addOrScriptHash.length === 64)
                    //{
                    console.log('Hash Length: ', addOrScriptHash.length);
                    urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/main/script/';
                    urlAdress02 = 'https://api.bitails.io/scripthash/';
                    //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                    //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                    //}
                    if (homenetwork === scrypt_ts_1.bsv.Networks.testnet) {
                        //urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/address/';
                        //urlAdress02 = 'https://test-api.bitails.io/address/';
                        //if(addOrScriptHash.length === 64)
                        //{
                        //https://api.whatsonchain.com/v1/bsv/main/script/995ea8d0f752f41cdd99bb9d54cb004709e04c7dc4088bcbbbb9ea5c390a43c3/unspent
                        //Returns a response as long as the response message is less than 1MB in size.
                        //https://api.bitails.io/scripthash/408d9e88bf59190a2504b0d5e8075fd456c1fe6c593a58177f6df5200e61d118/unspent
                        urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/script/';
                        urlAdress02 = 'https://test-api.bitails.io/scripthash/';
                        //urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
                        //urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
                        //}  
                    }
                    console.log('pool id', poolID);
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    utxoScript = '';
                    if (addOrScriptHash.length !== 64) {
                        utxoScript = scrypt_ts_1.bsv.Script.buildPublicKeyHashOut(addOrScriptHash).toHex();
                    }
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    switch (poolID) {
                        case 0:
                            url = new URL(urlAdress01 + addOrScriptHash + '/unconfirmed/history');
                            //TXJson = `{"txhex": "${TxHexBsv}" }`; 
                            break;
                        default:
                            url = new URL(urlAdress02 + addOrScriptHash + '/unspent');
                            //TXJson = `{"rawTx": "${TxHexBsv}" }`;
                            break;
                    }
                    console.log('URL', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    console.log('Success: ', resp);
                    //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
                    if (resp.indexOf('[]') === -1) {
                        //if (resp.indexOf('Not Found') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
                        console.log('Success: ', resp);
                        bcFinish = true;
                        if (resp.indexOf('Not Found') !== -1) {
                            res = JSON.parse('[{"tx_hash":"","height":-2}]');
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                txId: item.tx_hash,
                            }); });
                        }
                        else //if(poolID == 0)
                         {
                            index0 = resp.indexOf('"result":[');
                            jsonSTR = resp.substring(index0 + 9, resp.length);
                            jsonSTR = jsonSTR.substring(0, jsonSTR.indexOf(']') + 1);
                            console.log('res: ', resp.substring(resp.indexOf('"result":[') + 9, resp.length - (resp.length - resp.indexOf(',"error"'))));
                            console.log('jsonSTR: ', jsonSTR);
                            res = JSON.parse(jsonSTR);
                            console.log('res: ', res);
                            //utxos = res.body.map((item: any) => ({
                            utxos = res.map(function (item) { return ({
                                height: item.height,
                                txId: item.tx_hash,
                            }); });
                        }
                    }
                    else {
                        bcFinish = false;
                        res = JSON.parse('[{"tx_hash":"","height":-2}]');
                        utxos = res.map(function (item) { return ({
                            height: item.height,
                            //time: -2,
                            txId: item.tx_hash,
                            //outputIndex: item.tx_pos,
                            //satoshis: item.value,
                            //script: '',
                        }); });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_8 = _a.sent();
                    console.error(e_8);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    poolID++;
                    poolID = poolID % npools;
                    console.log('Pool id: ', poolID);
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, utxos];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, utxos];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.scriptHistoryUnc = scriptHistoryUnc;
//export async function listUnspent(addOrScriptHash: any, homenetwork: any): Promise <string>
function exchangeRate() {
    return __awaiter(this, void 0, void 0, function () {
        var npools, url, resp, bcFinish, cycle, exchangePrice, res, res, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    npools = 1 // somente WoC por enquanto
                    ;
                    resp = '';
                    bcFinish = false;
                    cycle = 0;
                    _a.label = 1;
                case 1:
                    if (!(!bcFinish && cycle < npools * 2)) return [3 /*break*/, 6];
                    url = new URL('https://api.whatsonchain.com/v1/bsv/main/exchangerate');
                    console.log('URL', url);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('URL', url);
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.text(); })
                            .then(function (data) {
                            //postMessage(data);
                            resp = data;
                            // Use the data from the response here
                        })
                            .catch(function (error) {
                            //console.error(error);
                            //postMessage(0);
                            resp = '';
                        })];
                case 3:
                    _a.sent();
                    //{"rate":47.355999999999995,"time":1700413530,"currency":"USD"} 
                    //if (resp.indexOf('[]') !== -1  || resp.indexOf('"time":') !== -1 || resp.indexOf('"height":') !== -1 ) {
                    if (resp.indexOf('Not Found') !== -1 || resp.indexOf('"time":') !== -1 || resp.indexOf('"rate":') !== -1) {
                        console.log('Success: ', resp);
                        bcFinish = true;
                        if (resp.indexOf('Not Found') !== -1) {
                            res = JSON.parse('[{"rate":0,"time":0,"currency":"USD"}]');
                            exchangePrice = res.map(function (item) { return ({
                                rate: item.rate,
                                time: item.time,
                                currecy: item.currency,
                            }); });
                        }
                        else //if(poolID == 0)
                         {
                            res = JSON.parse('[' + resp + ']');
                            console.log('res: ', res);
                            //utxos = res.body.map((item: any) => ({
                            exchangePrice = res.map(function (item) { return ({
                                rate: item.rate,
                                time: item.time,
                                currecy: item.currency,
                            }); });
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_9 = _a.sent();
                    console.error(e_9);
                    return [3 /*break*/, 5];
                case 5:
                    cycle++;
                    return [3 /*break*/, 1];
                case 6:
                    if (bcFinish) {
                        ///return resp
                        return [2 /*return*/, exchangePrice];
                    }
                    else {
                        //return ''
                        return [2 /*return*/, exchangePrice];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.exchangeRate = exchangeRate;
