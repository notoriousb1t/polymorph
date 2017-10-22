export function weighPath(left: number[], right: number[]): number {
  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    const distance = Math.abs(left[i] - right[i])
    sum += distance * distance;
  }
  return sum
}
