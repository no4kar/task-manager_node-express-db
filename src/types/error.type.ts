export namespace TyError {
  export type Code =
    | 400 // Bad Request
    | 401 // Unauthorized
    | 402 // Payment Required
    | 403 // Forbidden
    | 404 // Not Found
    | 405 // Method Not Allowed
    | 406 // Not Acceptable
    | 407 // Proxy Authentication Required
    | 408 // Request Timeout
    | 409 // Conflict
    | 410 // Gone
    | 411 // Length Required
    | 412 // Precondition Failed
    | 413 // Payload Too Large
    | 414 // URI Too Long
    | 415 // Unsupported Media Type
    | 416 // Range Not Satisfiable
    | 417 // Expectation Failed
    | 418 // I'm a teapot (April Fools' joke in RFC 2324)
    | 421 // Misdirected Request
    | 422 // Unprocessable Entity
    | 423 // Locked
    | 424 // Failed Dependency
    | 425 // Too Early
    | 426 // Upgrade Required
    | 427 // Unassigned (Not used)
    | 428 // Precondition Required
    | 429 // Too Many Requests
    ;

  export type CodeReport = {
    [key in Code]?: boolean; // Partial<Record<Code, boolean>> === [key in Code]?: boolean | undefined
  }

  export type FailedReport<
    T1 extends string,
    T2 = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
  > = {
      [key in T1]: {
        isInvalid: boolean;
        expected: 'natural number' | 'number' | 'string' | 'string[]' | string | RegExp;
        got: T2;
      };
    }

  export type Report<T = CodeReport> = {
    [key: string]: boolean | T;
  }
}
