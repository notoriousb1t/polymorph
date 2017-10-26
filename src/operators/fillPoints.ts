import { min, floor } from '../utilities/math';

export function fillPoints(larger: number[], smaller: number[]): void {
  if (larger.length < smaller.length) {
      // swap sides so larger is larger (or equal)
      return fillPoints(smaller, larger)
  }

  // number of cubic beziers
  const numberInSmaller = (smaller.length - 2) / 6
  const numberInLarger = (larger.length - 2) / 6
  const numberToInsert = numberInLarger - numberInSmaller
  if (numberToInsert === 0) {
      return
  }
  const dist = numberToInsert / numberInLarger

  for (let i = 0; i < numberToInsert; i++) {
      const index = min(floor(dist * i * 6) + 2, smaller.length)
      const x = smaller[index - 2]
      const y = smaller[index - 1]
      smaller.splice(index, 0, x, y, x, y, x, y)
  }
}
