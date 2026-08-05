import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export type TakeOfferBody = Record<string, unknown>;
export declare class TakeOfferRequest extends ApiRequest {
    fromaddress: string;
    offer: TakeOfferBody;
    returntx?: boolean;
    feeamount?: number;
    constructor(chain: string, fromaddress: string, offer: TakeOfferBody, returntx?: boolean, feeamount?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): TakeOfferRequest;
    toJson(): ApiPrimitiveJson;
}
