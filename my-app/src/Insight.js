"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Network_1 = require("./Network");
const axios_1 = require("axios");
const INSIGHT_BASEURLS = {
    [Network_1.NetworkNames.MAINNET]: "https://explorer.qtum.org/insight-api",
    [Network_1.NetworkNames.TESTNET]: "https://testnet.qtum.org/insight-api",
};
class Insight {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.axios = axios_1.default.create({
            baseURL,
        });
    }
    // public static mainnet(): Insight {
    //   return new Insight(MAINNET_API_BASEURL)
    // }
    // public static testnet(): Insight {
    //   return new Insight(TESTNET_API_BASEURL)
    // }
    static forNetwork(network) {
        const baseURL = INSIGHT_BASEURLS[network.name];
        if (baseURL == null) {
            throw new Error(`No Insight API defined for network: ${network.name}`);
        }
        return new Insight(baseURL);
    }
    listUTXOs(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axios.get(`/addr/${address}/utxo`);
            return res.data;
        });
    }
    getInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axios.get(`/addr/${address}`);
            return res.data;
        });
    }
    sendRawTx(rawtx) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axios.post("/tx/send", {
                rawtx,
            });
            return res.data;
        });
    }
    contractCall(address, encodedData) {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME wow, what a weird API design... maybe we should just host the RPC
            // server, with limited API exposed.
            const res = yield this.axios.get(`/contracts/${address}/hash/${encodedData}/call`);
            return res.data;
        });
    }
    /**
     * Estimate the fee per KB of txdata, in satoshi. Returns -1 if no estimate is
     * available. It always return -1 for testnet.
     *
     * @param nblocks
     */
    estimateFee(nblocks = 6) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axios.get(`/utils/estimatefee?nbBlocks=${nblocks}`);
            const feeRate = res.data;
            if (typeof feeRate !== "number" || feeRate < 0) {
                return -1;
            }
            return Math.ceil(feeRate * 1e8);
        });
    }
    /**
     * Estimate the fee per byte of txdata, in satoshi. Returns -1 if no estimate is
     * available. It always return -1 for testnet.
     *
     * @param nblocks
     */
    estimateFeePerByte(nblocks = 6) {
        return __awaiter(this, void 0, void 0, function* () {
            const feeRate = yield this.estimateFee();
            if (feeRate < 0) {
                return feeRate;
            }
            return Math.ceil(feeRate / 1024);
        });
    }
}
exports.Insight = Insight;
//# sourceMappingURL=Insight.js.map