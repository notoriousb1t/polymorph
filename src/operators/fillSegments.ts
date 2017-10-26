import { IPathSegment } from '../types';
import { fillObject } from '../utilities/objects';


export function fillSegments(larger: IPathSegment[], smaller: IPathSegment[]): void {
  const largeLen = larger.length
  const smallLen = smaller.length
  if (largeLen < smallLen) {
      // swap sides so larger is larger (or equal)
      return fillSegments(smaller, larger)
  }

  // resize the array
  smaller.length = largeLen

  for (let i = smallLen; i < largeLen; i++) {
      const l = larger[i]
      const d: number[] = Array(l.d.length)
      for (let k = 0; k < l.d.length; k += 2) {
          d[k] = l.ox
          d[k + 1] = l.oy
      }

      smaller[i] = fillObject({ d }, l)
  }
}
