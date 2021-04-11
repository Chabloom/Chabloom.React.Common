import { BaseViewModel } from "../modelBase";

export interface ProductViewModel extends BaseViewModel {
  readonly id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: Array<string>;
  pickupMethods: Array<string>;
}
