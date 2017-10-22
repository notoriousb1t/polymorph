import { IPathSegment } from '../types'
import { renderPath } from './render-path'

export function mix(leftSegments: IPathSegment[], rightSegments: IPathSegment[]): (offset: number) => string {
    if (leftSegments.length !== rightSegments.length) {
        // ensure there are an equal amount of segments
        fillSegments(leftSegments, rightSegments)
    }

    const leftSegment = leftSegments.map((s: IPathSegment) => s.d)
    const rightSegment = rightSegments.map((s: IPathSegment) => s.d)

    for (let i = 0; i < leftSegment.length; i++) {
        // ensure points in segments are equal length
        fillPoints(leftSegment[i], rightSegment[i])
    }

    return (offset: number) =>
        renderPath(
            offset === 0 ? leftSegment : offset === 1 ? rightSegment : mixPointArrays(leftSegment, rightSegment, offset)
        )
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
