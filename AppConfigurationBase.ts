export interface AppConfigurationBase {
  name: string;
  displayName: string;
  accountsFrontendPublicAddress: string;
  accountsBackendPublicAddress: string;
  billingFrontendPublicAddress: string;
  billingBackendPublicAddress: string;
  ecommerceFrontendPublicAddress: string;
  ecommerceBackendPublicAddress: string;
  transactionsFrontendPublicAddress: string;
  transactionsBackendPublicAddress: string;
}
