import { BaseViewModel } from "./modelBase";

export interface BaseApiType<T extends BaseViewModel> {
  readItems(token: string): Promise<[Array<T> | undefined, string]>;

  readItem(token: string, itemId: string): Promise<[T | undefined, string]>;

  addItem(token: string, item: T): Promise<[T | undefined, string]>;

  editItem(token: string, item: T): Promise<[T | undefined, string]>;

  deleteItem(token: string, item: T): Promise<string | undefined>;
}

export class BaseApi<T extends BaseViewModel> {
  _readItems = async (url: string, token: string, requireAuth = true): Promise<[Array<T> | undefined, string]> => {
    try {
      let response: Response;
      if (requireAuth) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "GET",
          headers: headers,
          credentials: "include",
        });
      } else {
        response = await fetch(url, {
          method: "GET",
        });
      }
      if (response.status === 200) {
        const retJson = await response.json();
        return [retJson, ""];
      } else {
        return [undefined, response.statusText];
      }
    } catch (e) {
      return [undefined, e.message];
    }
  };

  _readItem = async (url: string, token: string, requireAuth = true): Promise<[T | undefined, string]> => {
    try {
      let response: Response;
      if (requireAuth) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "GET",
          headers: headers,
          credentials: "include",
        });
      } else {
        response = await fetch(url, {
          method: "GET",
        });
      }
      if (response.status === 200) {
        const retJson = await response.json();
        return [retJson, ""];
      } else {
        return [undefined, response.statusText];
      }
    } catch (e) {
      return [undefined, e.message];
    }
  };

  _addItem = async (url: string, token: string, item: T, requireAuth = true): Promise<[T | undefined, string]> => {
    try {
      let response: Response;
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      if (requireAuth) {
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "POST",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(item),
        });
      } else {
        response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(item),
        });
      }
      if (response.status === 201) {
        const retJson = await response.json();
        return [retJson, ""];
      } else {
        return [undefined, response.statusText];
      }
    } catch (e) {
      return [undefined, e.message];
    }
  };

  _editItem = async (url: string, token: string, item: T, requireAuth = true): Promise<[T | undefined, string]> => {
    try {
      let response: Response;
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      if (requireAuth) {
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "PUT",
          headers: headers,
          credentials: "include",
          body: JSON.stringify(item),
        });
      } else {
        response = await fetch(url, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(item),
        });
      }
      if (response.status === 200) {
        const retJson = await response.json();
        return [retJson, ""];
      } else {
        return [undefined, response.statusText];
      }
    } catch (e) {
      return [undefined, e.message];
    }
  };

  _deleteItem = async (url: string, token: string, requireAuth = true): Promise<string | undefined> => {
    try {
      let response: Response;
      if (requireAuth) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        response = await fetch(url, {
          method: "DELETE",
          headers: headers,
        });
      } else {
        response = await fetch(url, {
          method: "DELETE",
        });
      }
      if (response.status === 204) {
        return undefined;
      } else {
        return response.statusText;
      }
    } catch (e) {
      return e.message;
    }
  };
}
