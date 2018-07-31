export function fillObject<T>(dest: Record<string, any>, src: T): T {
  dest = dest || {}
  for (let key in src) {
    key in dest || (dest[key] = src[key]);
  }
  return dest as T;
}
