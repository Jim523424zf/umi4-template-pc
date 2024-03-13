type PromiseFn<T> = (...args: any[]) => Promise<T>;

export function memoizePromise<T>(promiseFn: PromiseFn<T>): PromiseFn<T> {
  let cachedPromise: Promise<T> | null = null;

  return function (this: any, ...args: any[]): Promise<T> {
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = promiseFn.apply(this, args).finally(() => {
      cachedPromise = null;
    });

    return cachedPromise;
  };
}

export function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

/**
 * 判断是否是Promise
 * @param value
 * @returns
 */
export function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === "function";
}
