import { BaseApi, BaseApiType } from "../apiBase";
import { PaymentCardViewModel } from "./model";
import { AppConfiguration } from "../../../api";

export class PaymentCardsApi extends BaseApi<PaymentCardViewModel> implements BaseApiType<PaymentCardViewModel> {
  baseUrl: string;

  constructor() {
    super();
    this.baseUrl = `${AppConfiguration.transactionsBackendPublicAddress}/api/paymentCards`;
  }

  readItems(token: string): Promise<[Array<PaymentCardViewModel> | undefined, string]> {
    return this._readItems(`${this.baseUrl}`, token);
  }

  readItem(token: string, itemId: string): Promise<[PaymentCardViewModel | undefined, string]> {
    return this._readItem(`${this.baseUrl}/${itemId}`, token);
  }

  addItem(token: string, item: PaymentCardViewModel): Promise<[PaymentCardViewModel | undefined, string]> {
    return this._addItem(`${this.baseUrl}`, token, item);
  }

  editItem(token: string, item: PaymentCardViewModel): Promise<[PaymentCardViewModel | undefined, string]> {
    return this._editItem(`${this.baseUrl}/${item.id}`, token, item);
  }

  deleteItem(token: string, item: PaymentCardViewModel): Promise<string | undefined> {
    return this._deleteItem(`${this.baseUrl}/${item.id}`, token);
  }
}
