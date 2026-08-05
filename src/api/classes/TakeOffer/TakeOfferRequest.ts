import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
import { TAKE_OFFER } from "../../../constants/cmds";

export type TakeOfferBody = Record<string, unknown>;

export class TakeOfferRequest extends ApiRequest {
  fromaddress: string;
  offer: TakeOfferBody;
  returntx?: boolean;
  feeamount?: number;

  constructor(
    chain: string,
    fromaddress: string,
    offer: TakeOfferBody,
    returntx?: boolean,
    feeamount?: number
  ) {
    super(chain, TAKE_OFFER);
    this.fromaddress = fromaddress;
    this.offer = offer;
    this.returntx = returntx;
    this.feeamount = feeamount;
  }

  getParams(): RequestParams {
    const params = [
      this.fromaddress,
      this.offer,
      this.returntx == null ? false : this.returntx,
      this.feeamount,
    ];

    return params.filter((x) => x != null);
  }

  static fromJson(object: ApiPrimitiveJson): TakeOfferRequest {
    return new TakeOfferRequest(
      object.chain as string,
      object.fromaddress as string,
      object.offer as TakeOfferBody,
      object.returntx != null ? (object.returntx as boolean) : undefined,
      object.feeamount != null ? (object.feeamount as number) : undefined
    );
  }

  toJson(): ApiPrimitiveJson {
    return {
      chain: this.chain,
      fromaddress: this.fromaddress,
      offer: this.offer,
      returntx: this.returntx,
      feeamount: this.feeamount,
    };
  }
}
