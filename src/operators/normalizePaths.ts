import { IPathSegment, IPath } from '../types';
import { reversePoints } from './reversePoints';
import { fillSegments } from './fillSegments';
import { normalizePoints } from './normalizePoints';
import { fillPoints } from './fillPoints';

function sizeDesc(a: IPathSegment, b: IPathSegment): number {
  return b.p - a.p
}


export function normalizePaths(left: IPath, right: IPath): [number[][], number[][]] {
  // sort segments by perimeter size (more or less area)
  const leftPath = left.data.slice().sort(sizeDesc)
  const rightPath = right.data.slice().sort(sizeDesc)

  if (leftPath[0].p < 0) {
      // ensure left is drawn clockwise
      leftPath.forEach((s: IPathSegment) => reversePoints(s.d))
  }
  if (rightPath[0].p < 0) {
      // ensure right is drawn clockwise
      rightPath.forEach((s: IPathSegment) => reversePoints(s.d))
  }

  if (leftPath.length !== rightPath.length) {
      // ensure there are an equal amount of segments
      fillSegments(leftPath, rightPath)
  }

  const l = leftPath.map((p: IPathSegment) => p.d)
  const r = rightPath.map((p: IPathSegment) => p.d)

  for (let i = 0; i < leftPath.length; i++) {
      // shift on a common weighting system
      normalizePoints(l[i])
      normalizePoints(r[i])
  }

  for (let i = 0; i < leftPath.length; i++) {
      // ensure points in segments are equal length
      fillPoints(l[i], r[i])
  }
  return [l, r]
}
