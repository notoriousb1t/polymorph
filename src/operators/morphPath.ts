import { IPathSegment, IPath, IRenderer } from '../types'
import { renderPath } from './renderPath'
import { EPSILON, abs, floor, min } from '../utilities/math'
import { raiseError } from '../utilities/errors'
import { list } from '../utilities/list'

/**
 * Returns a function to interpolate between the two path shapes.  polymorph.parse() must be called
 * before invoking this function.  In most cases, it is more appropriate to use polymorph.morph() instead of this.
 * @param leftPath path model to interpolate
 * @param rightPath path model to interpolate
 */
export function morphPath(paths: IPath[]): (offset: number) => string {
    if (!paths || paths.length < 2) {
        raiseError('invalid arguments')
    }

    const items: IRenderer<number[][] | string>[] = []
    for (let h = 0; h < paths.length - 1; h++) {
        items.push(getPathInterpolator(paths[h], paths[h + 1]))
    }

    const len = items.length
    return (offset: number): string => {
        const d = len * offset
        const flr = min(floor(d), len - 1)
        return renderPath(items[flr]((d - flr) / (flr + 1)))
    }
}

function getPathInterpolator(left: IPath, right: IPath): IRenderer<number[][] | string> {
    const leftPath = left.data.slice()
    const rightPath = right.data.slice()

    if (leftPath.length !== rightPath.length) {
        // ensure there are an equal amount of segments
        fillSegments(leftPath, rightPath)
    }

    const leftSegment = leftPath.map(selectPath)
    const rightSegment = rightPath.map(selectPath)

    for (let i = 0; i < leftSegment.length; i++) {
        // ensure points in segments are equal length
        fillPoints(leftSegment[i], rightSegment[i])
    }

    return (offset: number) => {
        if (abs(offset - 0) < EPSILON) {
            return left.path
        }
        if (abs(offset - 1) < EPSILON) {
            return right.path
        }

        const results = list<number[]>(leftSegment.length)
        for (let h = 0; h < leftSegment.length; h++) {
            results[h] = mixPoints(leftSegment[h], rightSegment[h], offset)
        }
        return results
    }
}

function selectPath(s: IPathSegment): number[] {
    return s.d.slice()
}

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
        const x = l.w / 2 + l.x
        const y = l.h / 2 + l.y

        const d = list<number>(l.d.length)
        for (let k = 0; k < l.d.length; k += 2) {
            d[k] = x
            d[k + 1] = y
        }

        smaller[i] = { d, x: l.x, y: l.y, h: l.h, w: l.w }
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
        const index = min(floor(dist * i * 6) + 2, smaller.length)
        const x = smaller[index - 2]
        const y = smaller[index - 1]
        smaller.splice(index, 0, x, y, x, y, x, y)
    }
}

export function mixPoints(a: number[], b: number[], o: number): number[] {
    const results = list<number>(a.length)
    for (let i = 0; i < a.length; i++) {
        results[i] = a[i] + (b[i] - a[i]) * o
    }
    return results
}
