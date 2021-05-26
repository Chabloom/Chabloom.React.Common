import { BaseViewModel } from "./modelBase";

export interface BaseApiType<T extends BaseViewModel> {
  readAll(token: string): Promise<[Response | undefined, Array<T> | undefined, string]>;

  read(token: string, id: string): Promise<[Response | undefined, T | undefined, string]>;

  create(token: string, viewModel: T): Promise<[Response | undefined, T | undefined, string]>;

  edit(token: string, viewModel: T): Promise<[Response | undefined, T | undefined, string]>;

  delete(token: string, viewModel: T): Promise<[Response | undefined, string]>;
}

export class BaseApi<T extends BaseViewModel> {
  _getAll = async (
    url: string,
    token: string | undefined = undefined
  ): Promise<[Response | undefined, Array<T> | undefined, string]> => {
    let response: Response | undefined;
    let data: Array<T> | undefined;
    let message = "";
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
        message = response.statusText;
      }
    } catch (e) {
      message = e.message;
    }
    return [response, data, message];
  };

  _get = async (
    url: string,
    token: string | undefined = undefined
  ): Promise<[Response | undefined, T | undefined, string]> => {
    let response: Response | undefined;
    let data: T | undefined;
    let message = "";
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
        message = response.statusText;
      }
    } catch (e) {
      message = e.message;
    }
    return [response, data, message];
  };

  _post = async (
    url: string,
    token: string | undefined = undefined,
    viewModel: T | undefined = undefined
  ): Promise<[Response | undefined, T | undefined, string]> => {
    let response: Response | undefined;
    let data: T | undefined;
    let message = "";
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
        message = response.statusText;
      }
    } catch (e) {
      message = e.message;
    }
    return [response, data, message];
  };

  _put = async (
    url: string,
    token: string | undefined = undefined,
    viewModel: T | undefined = undefined
  ): Promise<[Response | undefined, T | undefined, string]> => {
    let response: Response | undefined;
    let data: T | undefined;
    let message = "";
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
        message = response.statusText;
      }
    } catch (e) {
      message = e.message;
    }
    return [response, data, message];
  };

  _delete = async (url: string, token: string | undefined = undefined): Promise<[Response | undefined, string]> => {
    let response: Response | undefined;
    let message = "";
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
        message = response.statusText;
      }
    } catch (e) {
      message = e.message;
    }
    return [response, message];
  };
}
