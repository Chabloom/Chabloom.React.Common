export interface BaseViewModel {
  [x: string]: boolean | number | string | Array<string> | { [id: string]: number } | undefined;
}
