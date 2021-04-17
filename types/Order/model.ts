import { BaseViewModel } from "../modelBase";

export interface OrderViewModel extends BaseViewModel {
  readonly id: string;
  pickupMethod: string;
  status: string;
  transactionId: string;
  productCounts: { [id: string]: number };
}
