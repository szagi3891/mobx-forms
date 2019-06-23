export class ResultValue<T> {
    constructor(readonly value: T) {}
}

export class ResultLoading {
}

export class ResultError {
    constructor(
        readonly message: string,
        readonly shouldBeShow: boolean = true,
    ) {}
}

export type Result<T> = ResultValue<T> | ResultLoading | ResultError;

export type ConversionFn<T, K> = (value: T) => Result<K>;
