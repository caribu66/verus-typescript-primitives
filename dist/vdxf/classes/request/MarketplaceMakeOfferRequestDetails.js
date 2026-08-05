"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceMakeOfferRequestDetails = exports.MarketplaceMakeBuyOfferParams = exports.MarketplaceMakeOfferParams = void 0;
const bn_js_1 = require("bn.js");
const varuint_1 = require("../../../utils/varuint");
const varint_1 = require("../../../utils/varint");
const bufferutils_1 = require("../../../utils/bufferutils");
const createHash = require("create-hash");
const TransferDestination_1 = require("../../../pbaas/TransferDestination");
const address_1 = require("../../../utils/address");
const vdxf_1 = require("../../../constants/vdxf");
const { BufferReader, BufferWriter } = bufferutils_1.default;
/**
 * Parameters a wallet needs to construct a Verus marketplace sell offer (makeoffer)
 * (partial makeoffer transaction) entirely client-side:
 *   vin[0]  = the offered identity's current definition UTXO (looked up on-chain
 *             by the wallet from offeredIdentityId via getidentity)
 *   vout[0] = forAmountSats of forCurrencyId paid to payoutDestination
 * signed SIGHASH_SINGLE | SIGHASH_ANYONECANPAY over the identity input.
 */
class MarketplaceMakeOfferParams {
    constructor(data) {
        this.offeredIdentityId = data === null || data === void 0 ? void 0 : data.offeredIdentityId;
        this.payoutDestination = data === null || data === void 0 ? void 0 : data.payoutDestination;
        this.forCurrencyId = data === null || data === void 0 ? void 0 : data.forCurrencyId;
        this.forAmountSats = (data === null || data === void 0 ? void 0 : data.forAmountSats) ? data.forAmountSats : new bn_js_1.BN(0, 10);
        this.expiryHeight = (data === null || data === void 0 ? void 0 : data.expiryHeight) ? data.expiryHeight : new bn_js_1.BN(0, 10);
    }
    getByteLength() {
        let length = 0;
        length += vdxf_1.HASH160_BYTE_LENGTH; // offeredIdentityId
        length += this.payoutDestination.getByteLength();
        length += vdxf_1.HASH160_BYTE_LENGTH; // forCurrencyId
        length += varint_1.default.encodingLength(this.forAmountSats);
        length += varint_1.default.encodingLength(this.expiryHeight);
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        writer.writeSlice((0, address_1.fromBase58Check)(this.offeredIdentityId).hash);
        writer.writeSlice(this.payoutDestination.toBuffer());
        writer.writeSlice((0, address_1.fromBase58Check)(this.forCurrencyId).hash);
        writer.writeVarInt(this.forAmountSats);
        writer.writeVarInt(this.expiryHeight);
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.offeredIdentityId = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.payoutDestination = new TransferDestination_1.TransferDestination();
        reader.offset = this.payoutDestination.fromBuffer(reader.buffer, reader.offset);
        this.forCurrencyId = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.forAmountSats = reader.readVarInt();
        this.expiryHeight = reader.readVarInt();
        return reader.offset;
    }
    isValid() {
        return (typeof this.offeredIdentityId === 'string' &&
            this.offeredIdentityId.length > 0 &&
            this.payoutDestination != null &&
            this.payoutDestination.isValid() &&
            typeof this.forCurrencyId === 'string' &&
            this.forCurrencyId.length > 0 &&
            this.forAmountSats.gt(new bn_js_1.BN(0, 10)) &&
            this.expiryHeight.gt(new bn_js_1.BN(0, 10)));
    }
    toJson() {
        return {
            offeredidentityid: this.offeredIdentityId,
            payoutdestination: this.payoutDestination.toJson(),
            forcurrencyid: this.forCurrencyId,
            foramount: this.forAmountSats.toString(10),
            expiryheight: this.expiryHeight.toString(10)
        };
    }
    static fromJson(json) {
        return new MarketplaceMakeOfferParams({
            offeredIdentityId: json.offeredidentityid,
            payoutDestination: TransferDestination_1.TransferDestination.fromJson(json.payoutdestination),
            forCurrencyId: json.forcurrencyid,
            forAmountSats: new bn_js_1.BN(json.foramount, 10),
            expiryHeight: new bn_js_1.BN(json.expiryheight, 10)
        });
    }
}
exports.MarketplaceMakeOfferParams = MarketplaceMakeOfferParams;
/**
 * Parameters for a buy-side makeoffer (bid): offer currency, want target identity.
 * Wallet calls native makeoffer with offer={currency,amount} and for=identity definition.
 */
class MarketplaceMakeBuyOfferParams {
    constructor(data) {
        this.targetIdentityId = data === null || data === void 0 ? void 0 : data.targetIdentityId;
        this.offeredCurrencyId = data === null || data === void 0 ? void 0 : data.offeredCurrencyId;
        this.offeredAmountSats = (data === null || data === void 0 ? void 0 : data.offeredAmountSats) ? data.offeredAmountSats : new bn_js_1.BN(0, 10);
        this.acceptDestination = data === null || data === void 0 ? void 0 : data.acceptDestination;
        this.changeDestination = data === null || data === void 0 ? void 0 : data.changeDestination;
        this.expiryHeight = (data === null || data === void 0 ? void 0 : data.expiryHeight) ? data.expiryHeight : new bn_js_1.BN(0, 10);
    }
    getByteLength() {
        let length = 0;
        length += vdxf_1.HASH160_BYTE_LENGTH;
        length += vdxf_1.HASH160_BYTE_LENGTH;
        length += varint_1.default.encodingLength(this.offeredAmountSats);
        length += this.acceptDestination.getByteLength();
        length += this.changeDestination.getByteLength();
        length += varint_1.default.encodingLength(this.expiryHeight);
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        writer.writeSlice((0, address_1.fromBase58Check)(this.targetIdentityId).hash);
        writer.writeSlice((0, address_1.fromBase58Check)(this.offeredCurrencyId).hash);
        writer.writeVarInt(this.offeredAmountSats);
        writer.writeSlice(this.acceptDestination.toBuffer());
        writer.writeSlice(this.changeDestination.toBuffer());
        writer.writeVarInt(this.expiryHeight);
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.targetIdentityId = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.offeredCurrencyId = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
        this.offeredAmountSats = reader.readVarInt();
        this.acceptDestination = new TransferDestination_1.TransferDestination();
        reader.offset = this.acceptDestination.fromBuffer(reader.buffer, reader.offset);
        this.changeDestination = new TransferDestination_1.TransferDestination();
        reader.offset = this.changeDestination.fromBuffer(reader.buffer, reader.offset);
        this.expiryHeight = reader.readVarInt();
        return reader.offset;
    }
    isValid() {
        return (typeof this.targetIdentityId === 'string' &&
            this.targetIdentityId.length > 0 &&
            typeof this.offeredCurrencyId === 'string' &&
            this.offeredCurrencyId.length > 0 &&
            this.offeredAmountSats.gt(new bn_js_1.BN(0, 10)) &&
            this.acceptDestination != null &&
            this.acceptDestination.isValid() &&
            this.changeDestination != null &&
            this.changeDestination.isValid() &&
            this.expiryHeight.gt(new bn_js_1.BN(0, 10)));
    }
    toJson() {
        return {
            targetidentityid: this.targetIdentityId,
            offeredcurrencyid: this.offeredCurrencyId,
            offeredamount: this.offeredAmountSats.toString(10),
            acceptdestination: this.acceptDestination.toJson(),
            changedestination: this.changeDestination.toJson(),
            expiryheight: this.expiryHeight.toString(10)
        };
    }
    static fromJson(json) {
        return new MarketplaceMakeBuyOfferParams({
            targetIdentityId: json.targetidentityid,
            offeredCurrencyId: json.offeredcurrencyid,
            offeredAmountSats: new bn_js_1.BN(json.offeredamount, 10),
            acceptDestination: TransferDestination_1.TransferDestination.fromJson(json.acceptdestination),
            changeDestination: TransferDestination_1.TransferDestination.fromJson(json.changedestination),
            expiryHeight: new bn_js_1.BN(json.expiryheight, 10)
        });
    }
}
exports.MarketplaceMakeBuyOfferParams = MarketplaceMakeBuyOfferParams;
class MarketplaceMakeOfferRequestDetails {
    constructor(data) {
        this.flags = data && data.flags ? data.flags : new bn_js_1.BN("0", 10);
        if (data === null || data === void 0 ? void 0 : data.rawTransactionHex) {
            if (!this.containsRawTx())
                this.toggleContainsRawTx();
            this.rawTransactionHex = data.rawTransactionHex;
        }
        if (data === null || data === void 0 ? void 0 : data.offerDescription) {
            if (!this.containsDesc())
                this.toggleContainsDesc();
            this.offerDescription = data.offerDescription;
        }
        if (data === null || data === void 0 ? void 0 : data.offerParams) {
            if (!this.containsOfferParams())
                this.toggleContainsOfferParams();
            this.offerParams = data.offerParams;
        }
        if (data === null || data === void 0 ? void 0 : data.buyParams) {
            if (!this.containsBuyParams())
                this.toggleContainsBuyParams();
            this.buyParams = data.buyParams;
        }
    }
    containsRawTx() {
        return !!(this.flags.and(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_RAW_TX).toNumber());
    }
    containsDesc() {
        return !!(this.flags.and(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_DESC).toNumber());
    }
    containsOfferParams() {
        return !!(this.flags.and(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_OFFER_PARAMS).toNumber());
    }
    containsBuyParams() {
        return !!(this.flags.and(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_BUY_PARAMS).toNumber());
    }
    toggleContainsRawTx() {
        this.flags = this.flags.xor(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_RAW_TX);
    }
    toggleContainsDesc() {
        this.flags = this.flags.xor(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_DESC);
    }
    toggleContainsOfferParams() {
        this.flags = this.flags.xor(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_OFFER_PARAMS);
    }
    toggleContainsBuyParams() {
        this.flags = this.flags.xor(MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_BUY_PARAMS);
    }
    isValid() {
        if (!this.containsRawTx() && !this.containsOfferParams() && !this.containsBuyParams())
            return false;
        if (this.containsOfferParams() && this.containsBuyParams())
            return false;
        if (this.containsRawTx() && !this.rawTransactionHex)
            return false;
        if (this.containsDesc() && !this.offerDescription)
            return false;
        if (this.containsOfferParams() && (this.offerParams == null || !this.offerParams.isValid())) {
            return false;
        }
        if (this.containsBuyParams() && (this.buyParams == null || !this.buyParams.isValid())) {
            return false;
        }
        return true;
    }
    toSha256() {
        return createHash("sha256").update(this.toBuffer()).digest();
    }
    getByteLength() {
        let length = 0;
        length += varuint_1.default.encodingLength(this.flags.toNumber());
        if (this.containsRawTx()) {
            length += varuint_1.default.encodingLength(Buffer.from(this.rawTransactionHex, 'hex').length);
            length += Buffer.from(this.rawTransactionHex, 'hex').length;
        }
        if (this.containsDesc()) {
            length += varuint_1.default.encodingLength(Buffer.from(this.offerDescription, 'utf8').length);
            length += Buffer.from(this.offerDescription, 'utf8').length;
        }
        if (this.containsOfferParams()) {
            const paramsLength = this.offerParams.getByteLength();
            length += varuint_1.default.encodingLength(paramsLength);
            length += paramsLength;
        }
        if (this.containsBuyParams()) {
            const paramsLength = this.buyParams.getByteLength();
            length += varuint_1.default.encodingLength(paramsLength);
            length += paramsLength;
        }
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        writer.writeCompactSize(this.flags.toNumber());
        if (this.containsRawTx()) {
            writer.writeVarSlice(Buffer.from(this.rawTransactionHex, 'hex'));
        }
        if (this.containsDesc()) {
            writer.writeVarSlice(Buffer.from(this.offerDescription, 'utf8'));
        }
        if (this.containsOfferParams()) {
            writer.writeVarSlice(this.offerParams.toBuffer());
        }
        if (this.containsBuyParams()) {
            writer.writeVarSlice(this.buyParams.toBuffer());
        }
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.flags = new bn_js_1.BN(reader.readCompactSize());
        if (this.containsRawTx()) {
            this.rawTransactionHex = reader.readVarSlice().toString('hex');
        }
        if (this.containsDesc()) {
            this.offerDescription = reader.readVarSlice().toString('utf8');
        }
        if (this.containsOfferParams()) {
            this.offerParams = new MarketplaceMakeOfferParams();
            this.offerParams.fromBuffer(reader.readVarSlice(), 0);
        }
        if (this.containsBuyParams()) {
            this.buyParams = new MarketplaceMakeBuyOfferParams();
            this.buyParams.fromBuffer(reader.readVarSlice(), 0);
        }
        return reader.offset;
    }
    toJson() {
        return {
            flags: this.flags ? this.flags.toString(10) : undefined,
            rawTransactionHex: this.containsRawTx() ? this.rawTransactionHex : undefined,
            offerDescription: this.containsDesc() ? this.offerDescription : undefined,
            offerParams: this.containsOfferParams() ? this.offerParams.toJson() : undefined,
            buyParams: this.containsBuyParams() ? this.buyParams.toJson() : undefined
        };
    }
    static fromJson(json) {
        return new MarketplaceMakeOfferRequestDetails({
            flags: json.flags ? new bn_js_1.BN(json.flags, 10) : undefined,
            rawTransactionHex: json.rawTransactionHex,
            offerDescription: json.offerDescription,
            offerParams: json.offerParams ? MarketplaceMakeOfferParams.fromJson(json.offerParams) : undefined,
            buyParams: json.buyParams ? MarketplaceMakeBuyOfferParams.fromJson(json.buyParams) : undefined
        });
    }
}
exports.MarketplaceMakeOfferRequestDetails = MarketplaceMakeOfferRequestDetails;
MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_VALID = new bn_js_1.BN(0, 10);
MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_RAW_TX = new bn_js_1.BN(1, 10);
MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_DESC = new bn_js_1.BN(2, 10);
MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_OFFER_PARAMS = new bn_js_1.BN(4, 10);
/** Buy-side makeoffer params (currency for identity). Mutually exclusive with sell offerParams. */
MarketplaceMakeOfferRequestDetails.MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_BUY_PARAMS = new bn_js_1.BN(8, 10);
