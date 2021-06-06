import { BaseViewModel } from "./modelBase";

export interface BaseApiType<T extends BaseViewModel> {
  getAll(token: string | undefined): Promise<Array<T> | undefined>;

  get(id: string, token: string | undefined): Promise<T | undefined>;

  create(viewModel: T, token: string | undefined): Promise<T | undefined>;

  edit(id: string, viewModel: T, token: string | undefined): Promise<T | undefined>;

  delete(id: string, token: string | undefined): Promise<boolean>;

  getLastError(): string;
}

export class BaseApi<T extends BaseViewModel> implements BaseApiType<T> {
  baseUrl = "";
  lastError = "";

  getAll(token: string | undefined = undefined): Promise<T[] | undefined> {
    return this._getAll(`${this.baseUrl}`, token);
  }

  get(id: string, token: string | undefined = undefined): Promise<T | undefined> {
    return this._get(`${this.baseUrl}/${id}`, token);
  }

  create(viewModel: T, token: string | undefined = undefined): Promise<T | undefined> {
    return this._create(`${this.baseUrl}`, viewModel, token);
  }

  edit(id: string, viewModel: T, token: string | undefined = undefined): Promise<T | undefined> {
    return this._edit(`${this.baseUrl}/${id}`, viewModel, token);
  }

  delete(id: string, token: string | undefined = undefined): Promise<boolean> {
    return this._delete(`${this.baseUrl}/${id}`, token);
  }

  getLastError(): string {
    return this.lastError;
  }

  _getAll = async (url: string, token: string | undefined = undefined): Promise<Array<T> | undefined> => {
    let response: Response | undefined;
    let data: Array<T> | undefined;
    try {
      if (token) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "GET",
          referrerPolicy: "origin",
          headers: headers,
          credentials: "include",
        });
      } else {
        response = await fetch(url, {
          method: "GET",
          referrerPolicy: "origin",
        });
      }
      if (response.status === 200) {
        data = await response.json();
      } else if (response.status !== 204) {
        this.lastError = response.statusText;
      }
    } catch (e) {
      this.lastError = e.message;
    }
    return data;
  };

  _get = async (url: string, token: string | undefined = undefined): Promise<T | undefined> => {
    let response: Response | undefined;
    let data: T | undefined;
    try {
      if (token) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "GET",
          referrerPolicy: "origin",
          headers: headers,
          credentials: "include",
        });
      } else {
        response = await fetch(url, {
          method: "GET",
          referrerPolicy: "origin",
        });
      }
      if (response.status === 200) {
        data = await response.json();
      } else if (response.status !== 204) {
        this.lastError = response.statusText;
      }
    } catch (e) {
      this.lastError = e.message;
    }
    return data;
  };

  _create = async (
    url: string,
    viewModel: T | undefined = undefined,
    token: string | undefined = undefined
  ): Promise<T | undefined> => {
    let response: Response | undefined;
    let data: T | undefined;
    try {
      const headers = new Headers();
      let body: string | undefined;
      if (viewModel) {
        headers.append("Content-Type", "application/json");
        body = JSON.stringify(viewModel);
      }
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "POST",
          referrerPolicy: "origin",
          headers: headers,
          credentials: "include",
          body: body,
        });
      } else {
        response = await fetch(url, {
          method: "POST",
          referrerPolicy: "origin",
          headers: headers,
          body: body,
        });
      }
      if (response.status === 200 || response.status === 201) {
        data = await response.json();
      } else if (response.status !== 204) {
        this.lastError = response.statusText;
      }
    } catch (e) {
      this.lastError = e.message;
    }
    return data;
  };

  _edit = async (
    url: string,
    viewModel: T | undefined = undefined,
    token: string | undefined = undefined
  ): Promise<T | undefined> => {
    let response: Response | undefined;
    let data: T | undefined;
    try {
      const headers = new Headers();
      let body: string | undefined;
      if (viewModel) {
        headers.append("Content-Type", "application/json");
        body = JSON.stringify(viewModel);
      }
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "PUT",
          referrerPolicy: "origin",
          headers: headers,
          credentials: "include",
          body: body,
        });
      } else {
        response = await fetch(url, {
          method: "PUT",
          referrerPolicy: "origin",
          headers: headers,
          body: body,
        });
      }
      if (response.status === 200) {
        data = await response.json();
      } else if (response.status !== 204) {
        this.lastError = response.statusText;
      }
    } catch (e) {
      this.lastError = e.message;
    }
    return data;
  };

  _delete = async (url: string, token: string | undefined = undefined): Promise<boolean> => {
    let response: Response | undefined;
    try {
      if (token) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "DELETE",
          referrerPolicy: "origin",
          headers: headers,
        });
      } else {
        response = await fetch(url, {
          method: "DELETE",
          referrerPolicy: "origin",
        });
      }
      if (response.status !== 200 && response.status !== 204) {
        this.lastError = response.statusText;
      }
    } catch (e) {
      this.lastError = e.message;
    }
    return true;
  };
}
