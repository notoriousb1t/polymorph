export function fillObject<T, TKey extends keyof T>(dest: Record<TKey, any>, src: T): T {
  for (let key in src) {
    if (!dest.hasOwnProperty(key)) {
      (dest as any)[key] = src[key]
    }
  }
  return dest as any as T;
}
