export function fillObject<T>(dest: Record<string, any>, src: T): T {
  dest = dest || {}
  for (let key in src) {
    dest[key] && dest[key] != 0 || (dest[key] = src[key]);
  }
  return dest as T;
}
