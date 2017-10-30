import { floor } from '../utilities/math';
import { distance } from '../utilities/distance';
import { FloatArray } from '../types';

/**
 * Approximates the perimeter around a shape
 * @param pts
 */
export function perimeterPoints(pts: FloatArray): number {
  let n = pts.length
  let x2 = pts[n - 2]
  let y2 = pts[n - 1]
  let p = 0

  for (let i = 0; i < n; i += 6) {
      p += distance(pts[i], pts[i + 1], x2, y2)
      x2 = pts[i]
      y2 = pts[i + 1]
  }

  return floor(p)
}
