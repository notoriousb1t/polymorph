import { IPathSegment, IPath } from '../types'
import { renderPath } from './renderPath'
import { weighPath } from './weighPath'
import { reversePath } from './reversePath'

const EPSILON = 2 ** -52;

/**
 * Returns a function to interpolate between the two path shapes.  polymorph.parse() must be called
 * before invoking this function.  In most cases, it is more appropriate to use polymorph.morph() instead of this.
 * @param leftPath path model to interpolate
 * @param rightPath path model to interpolate
 */
export function morphPath(leftPath: IPath, rightPath: IPath): (offset: number) => string {
    if (leftPath.data.length !== rightPath.data.length) {
        // ensure there are an equal amount of segments
        fillSegments(leftPath.data, rightPath.data)
    }

    const leftSegment = leftPath.data.map(selectPath)
    const rightSegment = rightPath.data.map(selectPath)

    for (let i = 0; i < leftSegment.length; i++) {
        const left = leftSegment[i]
        const right = rightSegment[i]
        // ensure points in segments are equal length
        fillPoints(left, right)

        // weigh paths and use reversed right if necessary
        // this is meant to minimize distance between points as a whole
        const rightReversed = reversePath(right)
        if (weighPath(left, right) > weighPath(left, rightReversed)) {
            rightSegment[i] = rightReversed
        }
    }

    return (offset: number) => {
      if (Math.abs(offset - 0) < EPSILON) {
        return leftPath.path
      }
      if (Math.abs(offset - 1) < EPSILON) {
        return rightPath.path
      }
      return renderPath(mixPointArrays(leftSegment, rightSegment, offset))
    }
}

function selectPath(s: IPathSegment): number[] {
  return s.d
}

function mixPointArrays(l: number[][], r: number[][], o: number): number[][] {
    return l.map((a: number[], h: number) => mixPoints(a, r[h], o))
}

export function fillSegments(larger: IPathSegment[], smaller: IPathSegment[]): void {
    if (larger.length < smaller.length) {
        // swap sides so larger is larger (or equal)
        return fillSegments(smaller, larger)
    }

    for (let i = smaller.length; i < larger.length; i++) {
        const l = larger[i]
        const x = l.w / 2 + l.x
        const y = l.h / 2 + l.y

        const s: IPathSegment = { d: [], x: l.x, y: l.y, h: l.h, w: l.w }
        for (let k = 0; k < l.d.length; k += 2) {
            s.d.push(x, y)
        }
        smaller.push(s)
    }
}

function fillPoints(larger: number[], smaller: number[]): void {
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
        const index = Math.min(Math.floor(dist * i * 6) + 2, smaller.length)
        const x = smaller[index - 2]
        const y = smaller[index - 1]

        if (x !== x || y !== y) {
            console.log('test', numberInSmaller, numberInLarger, numberToInsert, dist, index)
        }

        smaller.splice(index, 0, x, y, x, y, x, y)
    }
}

export function mixPoints(a: number[], b: number[], o: number): number[] {
    // paths should be the same length
    const results: number[] = []
    for (let i = 0; i < a.length; i++) {
        results.push(a[i] + (b[i] - a[i]) * o)
    }
    return results
}
