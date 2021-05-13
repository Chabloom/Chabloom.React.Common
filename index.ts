export interface Configuration {
  REACT_APP_ACCOUNTS_FRONTEND_ADDRESS: string;
  REACT_APP_BILLING_FRONTEND_ADDRESS: string;
  REACT_APP_ECOMMERCE_FRONTEND_ADDRESS: string;
  REACT_APP_TRANSACTIONS_FRONTEND_ADDRESS: string;
  REACT_APP_ACCOUNTS_BACKEND_ADDRESS: string;
  REACT_APP_BILLING_BACKEND_ADDRESS: string;
  REACT_APP_ECOMMERCE_BACKEND_ADDRESS: string;
  REACT_APP_TRANSACTIONS_BACKEND_ADDRESS: string;
}

declare global {
  interface Window {
    __env__: Configuration;
  }
}

window.__env__ = window.__env__ || {};

export * from "./api";
export * from "./components";
export * from "./images";

export * from "./AppContextBase";
