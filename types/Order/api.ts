import { ApplicationConfig } from "../../../types";
import { BaseApi, BaseApiType } from "../apiBase";
import { OrderViewModel } from "./model";

export class OrdersApi extends BaseApi<OrderViewModel> implements BaseApiType<OrderViewModel> {
  baseUrl: string;
  userId: string;

  constructor(userId = "") {
    super();
    this.baseUrl = `${ApplicationConfig.ecommerceBackendPublicAddress}/api/orders`;
    this.userId = userId;
  }

  readItems(token: string): Promise<[Array<OrderViewModel> | undefined, string]> {
    return this._readItems(`${this.baseUrl}?userId=${this.userId}`, token);
  }

  readItem(token: string, itemId: string): Promise<[OrderViewModel | undefined, string]> {
    return this._readItem(`${this.baseUrl}/${itemId}`, "", false);
  }

  addItem(token: string, item: OrderViewModel): Promise<[OrderViewModel | undefined, string]> {
    return this._addItem(`${this.baseUrl}`, "", item, false);
  }

  editItem(token: string, item: OrderViewModel): Promise<[OrderViewModel | undefined, string]> {
    item.userId = this.userId;
    return this._editItem(`${this.baseUrl}/${item.id}`, token, item);
  }

  deleteItem(token: string, item: OrderViewModel): Promise<string | undefined> {
    return this._deleteItem(`${this.baseUrl}/${item.id}`, token);
  }
}
