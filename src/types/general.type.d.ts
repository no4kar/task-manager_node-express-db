export namespace TyGeneral {
  export type EmptyObject
    = Record<string, never>;
  export type UnknownObject
    = Record<string, unknown>;
  export type AnyObject // not string, number, null, etc.
    = Record<string, any>;
  export type AnyValue
    = unknown; // or even `any` if needed

  export type Notification<
    T1,
    T2 = number
  > = {
    date: T2;
    content: T1;
  }

  export type PageFomServer<T> = {
    /** The total number of items found based on the search parameters. */
    total: number,
    /** An array of items of type T, representing the current page's data. */
    content: Array<T>,
    /** The maximum number of items that can be included on one page. */
    limit: number,
    /** The starting position or index of the current page's data in the overall dataset. */
    offset: number,
  };

  // To have autocompletion and avoid mistypes
  export type RequestMethod
    = 'GET'
    | 'POST'
    | 'PATCH'
    | 'DELETE';
  export type Status
    = 'IDLE'
    | 'LOADING'
    | 'SUCCEEDED'
    | 'FAILED';

  export type Image = {
    raw: Blob | File | null; // the original File/Blob if user just picked(frontend-only while user is editing)
    src: string | null;    // blob: URL or base64 string for <img src=...>
  };

}
