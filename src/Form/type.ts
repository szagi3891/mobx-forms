
export class ResultValue<T> {
    constructor(readonly value: T) {}
}

//class ResultWaiting {}

export class ResultError {
    constructor(readonly message: string) {}
}

export type Result<T> = ResultValue<T> /*| ResultWaiting*/ | ResultError;


export type ConversionFn<T, K> = (value: T) => Result<K>;
