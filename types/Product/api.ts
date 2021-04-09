import { ApplicationConfig } from "../../../types";
import { BaseApi, BaseApiType } from "../apiBase";
import { ProductViewModel } from "./model";

export class ProductsApi extends BaseApi<ProductViewModel> implements BaseApiType<ProductViewModel> {
  baseUrl: string;
  categoryId: string;

  constructor(categoryId = "") {
    super();
    this.baseUrl = `${ApplicationConfig.ecommerceBackendPublicAddress}/api/products`;
    this.categoryId = categoryId;
  }

  readItems(): Promise<[Array<ProductViewModel> | undefined, string]> {
    return this._readItems(`${this.baseUrl}?categoryId=${this.categoryId}`, "", false);
  }

  readItem(itemId: string): Promise<[ProductViewModel | undefined, string]> {
    return this._readItem(`${this.baseUrl}/${itemId}`, "", false);
  }

  addItem(token: string, item: ProductViewModel): Promise<[ProductViewModel | undefined, string]> {
    item.categoryId = this.categoryId;
    return this._addItem(`${this.baseUrl}`, token, item);
  }

  editItem(token: string, item: ProductViewModel): Promise<[ProductViewModel | undefined, string]> {
    item.categoryId = this.categoryId;
    return this._editItem(`${this.baseUrl}/${item.id}`, token, item);
  }

  deleteItem(token: string, item: ProductViewModel): Promise<string | undefined> {
    return this._deleteItem(`${this.baseUrl}/${item.id}`, token);
  }
}
