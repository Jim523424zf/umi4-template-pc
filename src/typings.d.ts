interface CommonError extends Error {
  message: string;
  cause: "business";
}

type KeyValuePair<K extends string, V> = {
  key: K;
  value: V;
};

type MapToKeyValuePair<T> = {
  [K in keyof T]: KeyValuePair<K, T[K]>;
}[keyof T];

type PartialArray<T> = Array<NonNullable<MapToKeyValuePair<T>>>;
