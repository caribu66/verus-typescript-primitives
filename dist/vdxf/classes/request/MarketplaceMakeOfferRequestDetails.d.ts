import { SerializableEntity } from '../../../utils/types/SerializableEntity';
import { BigNumber } from '../../../utils/types/BigNumber';
import { TransferDestination, TransferDestinationJson } from '../../../pbaas/TransferDestination';
export type MarketplaceMakeOfferParamsJson = {
    offeredidentityid: string;
    payoutdestination: TransferDestinationJson;
    forcurrencyid: string;
    foramount: string;
    expiryheight: string;
};
/** Buy-side makeoffer: lock currency, want target identity. */
export type MarketplaceMakeBuyOfferParamsJson = {
    targetidentityid: string;
    offeredcurrencyid: string;
    offeredamount: string;
    acceptdestination: TransferDestinationJson;
    changedestination: TransferDestinationJson;
    expiryheight: string;
};
export type MarketplaceMakeOfferRequestDetailsJson = {
    flags?: string;
    rawTransactionHex?: string;
    offerDescription?: string;
    offerParams?: MarketplaceMakeOfferParamsJson;
    buyParams?: MarketplaceMakeBuyOfferParamsJson;
};
/**
 * Parameters a wallet needs to construct a Verus marketplace sell offer (makeoffer)
 * (partial makeoffer transaction) entirely client-side:
 *   vin[0]  = the offered identity's current definition UTXO (looked up on-chain
 *             by the wallet from offeredIdentityId via getidentity)
 *   vout[0] = forAmountSats of forCurrencyId paid to payoutDestination
 * signed SIGHASH_SINGLE | SIGHASH_ANYONECANPAY over the identity input.
 */
export declare class MarketplaceMakeOfferParams implements SerializableEntity {
    offeredIdentityId: string;
    payoutDestination: TransferDestination;
    forCurrencyId: string;
    forAmountSats: BigNumber;
    expiryHeight: BigNumber;
    constructor(data?: {
        offeredIdentityId?: string;
        payoutDestination?: TransferDestination;
        forCurrencyId?: string;
        forAmountSats?: BigNumber;
        expiryHeight?: BigNumber;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    isValid(): boolean;
    toJson(): MarketplaceMakeOfferParamsJson;
    static fromJson(json: MarketplaceMakeOfferParamsJson): MarketplaceMakeOfferParams;
}
/**
 * Parameters for a buy-side makeoffer (bid): offer currency, want target identity.
 * Wallet calls native makeoffer with offer={currency,amount} and for=identity definition.
 */
export declare class MarketplaceMakeBuyOfferParams implements SerializableEntity {
    targetIdentityId: string;
    offeredCurrencyId: string;
    offeredAmountSats: BigNumber;
    acceptDestination: TransferDestination;
    changeDestination: TransferDestination;
    expiryHeight: BigNumber;
    constructor(data?: {
        targetIdentityId?: string;
        offeredCurrencyId?: string;
        offeredAmountSats?: BigNumber;
        acceptDestination?: TransferDestination;
        changeDestination?: TransferDestination;
        expiryHeight?: BigNumber;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    isValid(): boolean;
    toJson(): MarketplaceMakeBuyOfferParamsJson;
    static fromJson(json: MarketplaceMakeBuyOfferParamsJson): MarketplaceMakeBuyOfferParams;
}
export declare class MarketplaceMakeOfferRequestDetails implements SerializableEntity {
    flags?: BigNumber;
    rawTransactionHex?: string;
    offerDescription?: string;
    offerParams?: MarketplaceMakeOfferParams;
    buyParams?: MarketplaceMakeBuyOfferParams;
    static MARKETPLACE_MAKEOFFER_REQUEST_VALID: import("bn.js");
    static MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_RAW_TX: import("bn.js");
    static MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_DESC: import("bn.js");
    static MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_OFFER_PARAMS: import("bn.js");
    /** Buy-side makeoffer params (currency for identity). Mutually exclusive with sell offerParams. */
    static MARKETPLACE_MAKEOFFER_REQUEST_CONTAINS_BUY_PARAMS: import("bn.js");
    constructor(data?: {
        flags?: BigNumber;
        rawTransactionHex?: string;
        offerDescription?: string;
        offerParams?: MarketplaceMakeOfferParams;
        buyParams?: MarketplaceMakeBuyOfferParams;
    });
    containsRawTx(): boolean;
    containsDesc(): boolean;
    containsOfferParams(): boolean;
    containsBuyParams(): boolean;
    toggleContainsRawTx(): void;
    toggleContainsDesc(): void;
    toggleContainsOfferParams(): void;
    toggleContainsBuyParams(): void;
    isValid(): boolean;
    toSha256(): Buffer<ArrayBufferLike>;
    getByteLength(): number;
    toBuffer(): Buffer<ArrayBufferLike>;
    fromBuffer(buffer: Buffer, offset?: number): number;
    toJson(): MarketplaceMakeOfferRequestDetailsJson;
    static fromJson(json: MarketplaceMakeOfferRequestDetailsJson): MarketplaceMakeOfferRequestDetails;
}
