import { IPathSegment } from '../types';
import { fillObject } from '../utilities/objects';
import { createNumberArray } from '../utilities/createNumberArray';


export function fillSegments(larger: IPathSegment[], smaller: IPathSegment[], origin: { x: number, y: number }): void {
  const largeLen = larger.length
  const smallLen = smaller.length
  if (largeLen < smallLen) {
      // swap sides so larger is larger (or equal)
      return fillSegments(smaller, larger, origin)
  }

  // resize the array
  smaller.length = largeLen

  for (let i = smallLen; i < largeLen; i++) {
      const l = larger[i]
      const d = createNumberArray(l.d.length)
      for (let k = 0; k < l.d.length; k += 2) {
          d[k] = l.x + (l.w * origin.x)
          d[k + 1] = l.y + (l.y * origin.y)
      }

      smaller[i] = fillObject({ d }, l)
  }
}
