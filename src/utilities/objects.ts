export function fillObject<T>(dest: Record<string, any>, src: T): T {
  for (let key in src) {
    if (!dest.hasOwnProperty(key)) {
      dest[key] = src[key]
    }
  }
  return dest as T;
}
