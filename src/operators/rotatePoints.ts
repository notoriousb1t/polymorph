export function rotatePoints(ns: number[], count: number): void {
  while (count--) {
      ns.push(ns.shift())
  }
}
