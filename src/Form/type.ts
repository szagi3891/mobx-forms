export class ResultValue<T> {
    constructor(readonly value: T) {}
}

export class ResultError {
    //string - error
    //null - waiting for validation
    constructor(readonly message: string | null) {}
}

export type Result<T> = ResultValue<T> | ResultError;

export type ConversionFn<T, K> = (value: T) => Result<K>;
